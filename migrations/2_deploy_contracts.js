const TokenFarm = artifacts.require('TokenFarm');
const DsvToken = artifacts.require('DsvToken');
const DaiToken = artifacts.require('DaiToken');

module.exports = async function(deployer, network, accounts) {
	// Deploy Dai Token
	await deployer.deploy(DaiToken);
	const daiToken = await DaiToken.deployed();

	// Deploy DsvToken
	await deployer.deploy(DsvToken);
	const dsvToken = await DsvToken.deployed();

	// Deploy our TokenForm
	await deployer.deploy(TokenFarm, dsvToken.address, daiToken.address);
	const tokenFarm = await TokenFarm.deployed();

	// Transfer all DSV Tokens to the TokenFarm
  await dsvToken.transfer(tokenFarm.address, '1000000000000000000000000');
  
  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
};
