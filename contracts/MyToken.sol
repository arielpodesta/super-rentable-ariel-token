//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "./ERC20Mintable.sol";

contract MyToken is ERC20Mintable {
    // constructor(uint256 initialSupply)
    constructor() public ERC20("Super Rentable Ariel Token", "SRAT") {
        // _mint(msg.sender, initialSupply);

        _setupDecimals(0);
    }
}
