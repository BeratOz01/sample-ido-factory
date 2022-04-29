// Payment Token Contract Artifacts
const Payment = artifacts.require("PaymentToken");

// Imports
const { time } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const chai = require("chai");
const ChaiTruffle = require("chai-truffle");
const truffleAssert = require("truffle-assertions");

// Helper function
function toWei(value) {
  return web3.utils.toWei(value.toString(), "ether");
}
// Chai Configuration for Truffle
chai.use(ChaiTruffle);

//use default BigNumber
chai.use(require("chai-bignumber")());

contract("Payment Token", async function (accounts) {
  // Global variables for test cases
  let payment,
    owner = accounts[0],
    user1 = accounts[1];

  before(async () => {
    // Deploy Factory contract
    payment = await Payment.deployed();
  });

  describe("Deploy & Contract Initialization", () => {
    it("Contract should deploy successfully", async () => {
      let address = payment.address;

      expect(address).to.not.be.undefined;
      expect(address).to.not.equal("");
      expect(address).to.not.equal(0x0);
    });

    it("Variable should initialize correctly", async () => {
      let name = await payment.name();
      let symbol = await payment.symbol();
      let cooldownTime = await payment.COOLDOWN_TIME();
      let expectedCooldownTime = 60 * 10;

      expect(name).to.equal("PaymentToken");
      expect(symbol).to.equal("PTKN");
      expect(cooldownTime.toNumber()).to.be.bignumber.equal(
        expectedCooldownTime
      );
    });

    it("Should mint 1000 ether of Payment Token to owner of contract", async () => {
      let balanceOfOwner = await payment.balanceOf(owner);
      expect(balanceOfOwner.toString()).to.be.bignumber.equal(toWei(1000));
    });
  });

  describe("Cooldown", () => {
    it("Cooldown should initialize correctly", async () => {
      let cooldown = await payment.getRemainingCooldown__sender({
        from: owner,
      });

      expect(cooldown.toNumber()).to.be.equal(0);
    });

    it("User can request payment token and mint 10 ether payment token", async () => {
      await payment.requestPaymentToken({ from: user1 });
      let balanceAfterRequest = await payment.balanceOf(user1);
      expect(balanceAfterRequest.toString()).to.be.equal(toWei(10));
    });

    it("After request user needs to wait 10 minutes for another 10 ether payment token", async () => {
      await truffleAssert.reverts(
        payment.requestPaymentToken({ from: user1 }),
        "User is on cooldown"
      );
    });

    it("After 10 minutes user can request payment token again", async () => {
      await time.increase(time.duration.minutes(10));
      await payment.requestPaymentToken({ from: user1 });
      let balanceAfterRequest = await payment.balanceOf(user1);
      expect(balanceAfterRequest.toString()).to.be.equal(toWei(20));
    });
  });
});
