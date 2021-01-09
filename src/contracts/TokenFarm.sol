pragma solidity ^0.5.0;

import './DsvToken.sol';
import './DaiToken.sol';

contract TokenFarm {

    address public owner;
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
        owner = msg.sender;
    }

    // Stakes Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        // Require Amount greater than zero
        require(_amount > 0, "Amount cant be zero");

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

    // Issuing Tokens (Interest)
    function issueTokens() public {
        require(msg.sender == owner, "Caller must be owner");

        // Issuing DSV Tokens for all the stakers
        for(uint i = 0; i < stakers.length; i++) {
        // For every user who staked inside this app fetch their staking balance and 
        // send same amount of dsvTokens
           address recipient = stakers[i]; 
           uint balance = stakingBalance[recipient];
           if(balance > 0) {
           dsvToken.transfer(recipient, balance);
           }
        }
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, 'balance must be greater than 0');

        // Transfer Mock Dai Tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset Staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }
}