// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token1 is ERC20, Ownable {
    event mint_(address deployer);

    constructor() ERC20("Token1", "T1") {}

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
        emit mint_(account);
    }
}
