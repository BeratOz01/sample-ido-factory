const Factory = artifacts.require("Factory");
const Portfolio = artifacts.require("Portfolio");
const PaymentToken = artifacts.require("PaymentToken");
const ProjectToken = artifacts.require("ProjectToken");
const TokenCreator = artifacts.require("TokenCreator");

module.exports = async function (deployer, networks, accounts) {
  // Global variables for the contract
  const admin = accounts[0];

  // Deploy portfolio contract
  await deployer.deploy(Portfolio, { from: admin });

  const portfolioAddress = Portfolio.address;

  // Deploy payment token
  await deployer.deploy(PaymentToken, { from: admin });

  // Instance of Payment Token Contract
  const paymentTokenAddress = PaymentToken.address;

  // Deploy Factory contract
  await deployer.deploy(Factory, paymentTokenAddress, portfolioAddress, {
    from: admin,
  });

  // Deploy Token Creator contract
  await deployer.deploy(TokenCreator, Portfolio.address, { from: admin });

  // Factory contract address
  const factoryAddress = Factory.address;

  // Set Factory contract address in Portfolio Contract
  const portfolioInstance = await Portfolio.deployed();

  await portfolioInstance.setFactoryContract(factoryAddress, {
    from: admin,
  });

  // Set token creator contract address in Portfolio Contract
  await portfolioInstance.setTokenCreator(TokenCreator.address, {
    from: admin,
  });

  // Deploy Sample Project Token from token creator
  await deployer.deploy(ProjectToken, "Project Token", "SPT", 100000, admin, {
    from: admin,
  });
};
