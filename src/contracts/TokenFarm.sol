pragma solidity ^0.5.0;

import './DsvToken.sol';
import './DaiToken.sol';

contract TokenFarm {

    string public name = "Token Farm";
    DsvToken public dsvToken;
    DaiToken public daiToken; 

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor(DsvToken _dsvToken, DaiToken _daiToken) public {
        dsvToken = _dsvToken;
        daiToken = _daiToken;
    }

    // Stakes Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add users to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Updating staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)

    // Issuing Tokens (Interest)

}