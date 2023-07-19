// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token0 is ERC20, Ownable {
    constructor() ERC20("Token0", "T0") {}

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
}
