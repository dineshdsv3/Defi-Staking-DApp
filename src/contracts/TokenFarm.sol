pragma solidity ^0.5.0;

import './DsvToken.sol';
import './DaiToken.sol';

contract TokenFarm {

    string public name = "Token Farm";
    DsvToken public dsvToken;
    DaiToken public daiToken; 

    constructor(DsvToken _dsvToken, DaiToken _daiToken) public {
        dsvToken = _dsvToken;
        daiToken = _daiToken;
    }
}