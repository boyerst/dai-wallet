pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DaiTokenMock is ERC20 {
  string  public name;
  string  public symbol;
  uint256 public decimals;

  constructor() public {
    name = "Dai Stablecoin (DAI)";
    symbol = "DAI";
    decimals = 18;
  }
}