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

	describe('Farming tokens', async () => {
		it('rewards investors for mDai tokens', async () => {
			let result;

			// Check investor balance before staking
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');

			// Stake Mock DAI Tokens
			await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
			await tokenFarm.stakeTokens(tokens('100'), { from: investor });

			// Checking staking result
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

			result = await daiToken.balanceOf(tokenFarm.address);
			assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI wallet balance correct after staking');

			result = await tokenFarm.stakingBalance(investor);
			assert.equal(result.toString(), tokens('100'), 'Investor Stacking balance correct after staking');

			result = await tokenFarm.isStaking(investor);
			assert.equal(result.toString(), 'true', 'Investor staking status correct after staking');

			// Issue Tokens
			await tokenFarm.issueTokens({ from: owner });

			// Check balances after issuance
			result = await dsvToken.balanceOf(investor);
			assert.equal(
				result.toString(),
				tokens('100'),
				'Investor DSV Token wallet balance correct after issuing tokens'
			);

			// ensure that only owner can issue tokens
			await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

			// unstake Tokens
			await tokenFarm.unstakeTokens({ from: investor });

			// Check results after unstacking
			result = await dsvToken.balanceOf(investor);
			assert.equal(result.toString(), tokens('100'), 'Investor Mock Dai wallet balance correct after staking');

			result = await daiToken.balanceOf(tokenFarm.address);
			assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking');

			result = await tokenFarm.stakingBalance(investor);
			assert.equal(result.toString(), tokens('0'), 'Investor staking balance correct after staking');

			result = await tokenFarm.isStaking(investor);
			assert.equal(result.toString(), 'false', 'Investor staking status correct after staking');
		});
	});
});