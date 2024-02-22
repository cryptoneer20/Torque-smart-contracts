// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

//  _________  ________  ________  ________  ___  ___  _______
// |\___   ___\\   __  \|\   __  \|\   __  \|\  \|\  \|\  ___ \
// \|___ \  \_\ \  \|\  \ \  \|\  \ \  \|\  \ \  \\\  \ \   __/|
//     \ \  \ \ \  \\\  \ \   _  _\ \  \\\  \ \  \\\  \ \  \_|/__
//      \ \  \ \ \  \\\  \ \  \\  \\ \  \\\  \ \  \\\  \ \  \_|\ \
//       \ \__\ \ \_______\ \__\\ _\\ \_____  \ \_______\ \_______\
//        \|__|  \|_______|\|__|\|__|\|___| \__\|_______|\|_______|

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract UniswapComp is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    IERC20 public compToken;
    IERC20 public wethToken;
    ISwapRouter public swapRouter;

    uint24 poolFee = 0;

    INonfungiblePositionManager positionManager;
    uint256 slippage = 20;
    uint128 liquiditySlippage = 10;
    int24 tickLower = -887220;
    int24 tickUpper = 887220;
    uint256 tokenId;
    address controller;

    bool poolInitialized = false;

    event Deposited(uint256 amount);
    event Withdrawal(uint256 amount);

    constructor(
        address _compToken,
        address _wethToken,
        address _positionManager,
        address _swapRouter
    ){
        compToken = IERC20(_compToken);
        wethToken = IERC20(_wethToken);
        positionManager = INonfungiblePositionManager(_positionManager);
        swapRouter = ISwapRouter(_swapRouter);
    }

    function deposit(uint256 amount) external nonReentrant{
        require(msg.sender == controller, "Only controller can call this!");
        compToken.transferFrom(msg.sender, address(this), amount);
        uint256 compToConvert = amount / 2;
        uint256 compToKeep = amount - compToConvert;
        uint256 wethAmount = convertComptoWETH(compToConvert);
        compToken.approve(address(positionManager), compToKeep);
        wethToken.approve(address(positionManager), wethAmount);
        uint256 amount0Min = compToKeep * (1000 - slippage) / 1000;
        uint256 amount1Min = wethAmount * (1000 - slippage) / 1000;
        if(!poolInitialized){
            INonfungiblePositionManager.MintParams memory params = createMintParams(compToKeep, wethAmount, amount0Min, amount1Min);
            (tokenId,,,) = positionManager.mint(params);
            poolInitialized = true;
        }else{
            INonfungiblePositionManager.IncreaseLiquidityParams memory increaseLiquidityParams = createIncreaseLiquidityParams(compToKeep, wethAmount, amount0Min, amount1Min);
            positionManager.increaseLiquidity(increaseLiquidityParams);
        }
        emit Deposited(amount);
    }

    function withdraw(uint256 amount, uint256 totalAsset) external nonReentrant{
        require(msg.sender == controller, "Only controller can call this!");
        require(amount > 0, "Invalid amount");
        (,,,,,,,uint128 liquidity,,,,) = positionManager.positions(tokenId);
        uint128 liquidityAmount = uint128(liquidity) * uint128(amount) / (uint128(totalAsset));
        liquidityAmount = liquidityAmount * (1000 - liquiditySlippage) / 1000;
        INonfungiblePositionManager.DecreaseLiquidityParams memory decreaseLiquidityParams = INonfungiblePositionManager.DecreaseLiquidityParams({
            tokenId: tokenId,
            liquidity: liquidityAmount,
            amount0Min: 0,
            amount1Min: 0,
            deadline: block.timestamp + 2 minutes
        });
        (uint256 amount0, uint256 amount1) = positionManager.decreaseLiquidity(decreaseLiquidityParams);
        INonfungiblePositionManager.CollectParams memory collectParams = INonfungiblePositionManager.CollectParams({
            tokenId: tokenId,
            recipient: address(this),
            amount0Max: uint128(amount0),
            amount1Max: uint128(amount1)
        });
        positionManager.collect(collectParams);
        uint256 convertedCompAmount = convertWETHtoComp(amount1);
        amount0 = amount0.add(convertedCompAmount);
        compToken.transfer(msg.sender, amount0);
        emit Withdrawal(amount);
    }

    function compound() external {
        require(msg.sender == controller, "Only controller can call this!");
        INonfungiblePositionManager.CollectParams memory collectParams =
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });
        (, uint256 wethVal) = positionManager.collect(collectParams);
        convertWETHtoComp(wethVal);
        uint256 compAmount = compToken.balanceOf(address(this));
        compToken.transfer(msg.sender, compAmount);
    }

    function setController(address _controller) external onlyOwner(){
        controller = _controller;
    }

    function createMintParams(uint256 compToKeep, uint256 wethAmount, uint256 amount0Min, uint256 amount1Min) internal view returns(INonfungiblePositionManager.MintParams memory){
        return  INonfungiblePositionManager.MintParams({
            token0: address(compToken),
            token1: address(wethToken),
            fee: poolFee,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: compToKeep,
            amount1Desired: wethAmount,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            recipient: address(this),
            deadline: block.timestamp + 2 minutes
        });
    }

    function createIncreaseLiquidityParams(uint256 compToKeep, uint256 wethAmount, uint256 amount0Min, uint256 amount1Min) internal view returns (INonfungiblePositionManager.IncreaseLiquidityParams memory){
        return INonfungiblePositionManager.IncreaseLiquidityParams({
            tokenId: tokenId,
            amount0Desired: compToKeep,
            amount1Desired: wethAmount,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            deadline: block.timestamp + 2 minutes
        });
    }

    function setTokenId(uint256 _tokenId) external onlyOwner(){
        require(poolInitialized==false, "TokenId already set");
        tokenId = _tokenId;
        poolInitialized = true;
    }

    function setTickRange(int24 _tickLower, int24 _tickUpper) external onlyOwner() {
        require(_tickLower < _tickUpper, "Invalid tick range");
        tickLower = _tickLower;
        tickUpper = _tickUpper;
    }

    function setSlippage(uint256 _slippage) external onlyOwner() {
        slippage = _slippage;
    }

    function setLiquiditySlippage(uint128 _slippage) external onlyOwner{
        liquiditySlippage = _slippage;
    }

    function setPoolFee(uint24 _poolFee) external onlyOwner {
        poolFee = _poolFee;
    }

    function convertComptoWETH(uint256 compAmount) internal returns(uint256){
        compToken.approve(address(swapRouter), compAmount);
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(compToken),
                tokenOut: address(wethToken),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: compAmount,
                amountOutMinimum:0,
                sqrtPriceLimitX96: 0
            });
        return swapRouter.exactInputSingle(params);
    }

    function convertWETHtoComp(uint256 wethAmount) internal returns(uint256){
        wethToken.approve(address(swapRouter), wethAmount);
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(wethToken),
                tokenOut: address(compToken),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: wethAmount,
                amountOutMinimum:0,
                sqrtPriceLimitX96: 0
            });
        return swapRouter.exactInputSingle(params);
    }
}