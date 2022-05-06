// Contracts Artifacts
const Portfolio = artifacts.require("Portfolio");
const TokenCreator = artifacts.require("TokenCreator");

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

contract("Creator Contract", async (accounts) => {
  let creator,
    portfolio,
    owner = accounts[0],
    user1 = accounts[1];

  before(async () => {
    creator = await TokenCreator.deployed();
    portfolio = await Portfolio.deployed();
  });

  describe("Deploy & Contract Initialization", () => {
    it("Should deploy successfully", async () => {
      let address = creator.address;

      expect(address).to.not.be.undefined;
      expect(address).to.not.equal("");
      expect(address).to.not.equal(0x0);
    });

    it("Should initialize correctly", async () => {
      let cooldownTime = await creator.COOLDOWN_TIME();
      let expectedCooldownTime = 60 * 10;

      let maxAmount = await creator.MAX_AMOUNT();
      let expectedMaxAmount = 5;

      expect(cooldownTime.toNumber()).to.be.equal(expectedCooldownTime);
      expect(maxAmount.toNumber()).to.be.equal(expectedMaxAmount);
    });
  });

  describe("Create ERC20 Tokens", () => {
    it("Can create ERC20 token with creator contract", async () => {
      let name = "TestName";
      let symbol = "TestSymbol";
      let totalSupply = 1000;

      await creator.createToken(name, symbol, totalSupply, { from: owner });
    });

    it("Should add struct to mapping array", async () => {
      let tokens = await creator.getMyTokens({ from: owner });

      expect(tokens.length).to.be.equal(1);
    });
  });

  describe("Portfolio", () => {
    it("Should add token to portfolio", async () => {
      let port = await portfolio.getMyERC20s({ from: owner });
      expect(port.length).to.be.equal(1);
    });
  });
});
