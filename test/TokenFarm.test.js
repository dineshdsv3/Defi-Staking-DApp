const DaiToken = artifacts.require('DaiToken');
const DsvToken = artifacts.require('DsvToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
	.use(require('chai-as-promised'))
	.should();

function tokens(n) {
	return web3.utils.toWei(n, 'Ether');
}

contract('TokenFarm', ([owner, investor]) => {
	let daiToken, dsvToken, tokenFarm;

	before(async () => {
		// Load Contracts before the testing
		daiToken = await DaiToken.new();
		dsvToken = await DsvToken.new();
		tokenFarm = await TokenFarm.new(dsvToken.address, daiToken.address);

		// Transfer all Dapp Tokens to farm(1 Million)
		await dsvToken.transfer(tokenFarm.address, tokens('1000000'));

		await daiToken.transfer(investor, tokens('100'), { from: owner });
	});

	describe('Mock DAI deployment', async () => {
		it('has a name', async () => {
			const name = await daiToken.name();
			assert.equal(name, 'Mock DAI Token');
		});
	});

	describe('DSV Token deployment', async () => {
		it('has a name', async () => {
			const name = await dsvToken.name();
			assert.equal(name, 'DSV Token');
		});
	});

	describe('Token Farm deployment', async () => {
		it('has a name', async () => {
			const name = await tokenFarm.name();
			assert.equal(name, 'Token Farm');
		});

		it('contract has tokens', async () => {
			let balance = await dsvToken.balanceOf(tokenFarm.address);
			assert.equal(balance.toString(), tokens('1000000'));
		});
	});
});
