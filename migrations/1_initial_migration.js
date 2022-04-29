const Factory = artifacts.require("Factory");
const PaymentToken = artifacts.require("PaymentToken");

module.exports = async function (deployer, networks, accounts) {
  // Global variables for the contract
  const admin = accounts[0];

  // Deploy payment token
  await deployer.deploy(PaymentToken, { from: admin });

  // Instance of Payment Token Contract
  const paymentTokenAddress = PaymentToken.address;

  // Deploy Factory contract
  await deployer.deploy(Factory, paymentTokenAddress, { from: admin });
};
