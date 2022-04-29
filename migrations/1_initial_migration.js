const Factory = artifacts.require("Factory");
const Portfolio = artifacts.require("Portfolio");
const PaymentToken = artifacts.require("PaymentToken");
const ProjectToken = artifacts.require("ProjectToken");

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

  // Factory contract address
  const factoryAddress = Factory.address;

  // Set Factory contract address in Portfolio Contract
  const portfolioInstance = await Portfolio.deployed();

  await portfolioInstance.setFactoryContract(factoryAddress, {
    from: admin,
  });

  // Deploy Sample Project Token
  await deployer.deploy(ProjectToken, { from: admin });
};
