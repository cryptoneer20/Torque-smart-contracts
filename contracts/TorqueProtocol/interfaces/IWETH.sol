// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IWETH {
    function deposit() external payable;

    function withdraw(uint wad) external;

    function balanceOf(address account) external view returns(uint256);

    function transfer(address to, uint256 amount) external returns(bool);

    function transferFrom(address from, address to, uint256 amount) external returns(bool);
}