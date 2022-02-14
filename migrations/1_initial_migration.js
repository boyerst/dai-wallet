const Migrations = artifacts.require("Migrations");
const DaiTokenMock = artifacts.require("DaiTokenMock");


module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed()
  // Mint 1000 tokens for the Deployer
  await tokenMock.mint(
    '0xfa7A3d6eC5Bc1e722aF8Ee6c5ad227a708907Ae1',
    // The amount = 1000 + 18 zeros (because the token has 18 decimals)
    // You can do this with helper or web3.js but sometimes it is best to be explicit in migrations
    '1000000000000000000000'
  )
};
