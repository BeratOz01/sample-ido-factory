// Contracts Artifacts
const Factory = artifacts.require("Factory");
const Sale = artifacts.require("Sale");
const Payment = artifacts.require("PaymentToken");
const ProjectToken = artifacts.require("ProjectToken");
const Portfolio = artifacts.require("Portfolio");

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

// Global Variables
const SALE_NAME = "First Sale";
const NUMBER_OF_PORTIONS = 4;
const TIME_BETWEEN_PORTIONS = 10 * 60; // 10 Minutes
const PRICE = toWei(0.5);

contract("Portfolio", async (accounts) => {
  let portfolio,
    factory,
    payment,
    project,
    sale,
    owner = accounts[0],
    user1 = accounts[1],
    user2 = accounts[2];

  before(async () => {
    portfolio = await Portfolio.deployed();
    factory = await Factory.deployed();
    payment = await Payment.deployed();
    project = await ProjectToken.deployed();
  });

  describe("Deploy & Contract Initialization", () => {
    it("Should deploy successfully", async () => {
      let address = portfolio.address;

      expect(address).to.not.be.undefined;
      expect(address).to.not.equal("");
      expect(address).to.not.equal(0x0);
    });

    it("Should set factoryContract correctly", async () => {
      let factoryAddress = await portfolio.factoryContract();
      expect(factoryAddress).to.be.equal(factory.address);
    });

    it("At the beginning portfolio should be empty", async () => {
      let p = await portfolio.getMyPortfolio({ from: user1 });
      expect(p.length).to.be.equal(0);
    });
  });

  describe("Buy token from valid sale", () => {
    it("Should add an investment to portfolio when buy from valid sale", async () => {
      await factory.createSale(
        SALE_NAME,
        NUMBER_OF_PORTIONS,
        TIME_BETWEEN_PORTIONS,
        PRICE,
        project.address,
        { from: owner }
      );
      let s = await factory.getSale(0);

      sale = await Sale.at(s.saleAddress);

      // Payment Token transfer from owner to user1
      await payment.transfer(user1, toWei(100), { from: owner });

      // Project token transfer from owner to sale contract
      await project.transfer(sale.address, toWei(100), { from: owner });

      // Gives approve user1 to sale contract
      await payment.approve(sale.address, toWei(10), { from: user1 });

      // Buy from sale contract
      await sale.buy(toWei(5), { from: user1 });
    });

    it("Sale contract should update info array", async () => {
      let expectedInProjectToken = toWei(5) / PRICE;
      let infoArr = await sale.getInfo__sender({ from: user1 });
      // Local variable for check sum of balance
      let sum = 0;
      for (let portion of infoArr) {
        sum += parseInt(portion.amount);
      }

      expect(sum.toString()).to.be.equal(toWei(expectedInProjectToken));
    });
  });

  describe("Must have been added to Decentralized portfolio", () => {
    it("Should add an investment to portfolio when buy from valid sale", async () => {
      let p = await portfolio.getMyPortfolio({ from: user1 });
      expect(p.length).to.be.equal(1);
    });

    it("Should add an investment to portfolio when buy from valid sale", async () => {
      let p = await portfolio.getMyPortfolio({ from: user1 });
      let firstInvestment = p[0];

      expect(firstInvestment.saleName).to.be.equal(SALE_NAME);
      expect(firstInvestment.isPortionWithdrawn.length).to.be.equal(
        NUMBER_OF_PORTIONS
      );
      expect(firstInvestment.distributionDates.length).to.be.equal(
        NUMBER_OF_PORTIONS
      );
      expect(firstInvestment.isFinished).to.be.false;
      expect(firstInvestment.price.toString()).to.be.equal(PRICE.toString());
      expect(firstInvestment.tokenAddress).to.be.equal(project.address);
      expect(firstInvestment.withdrawnAmount.toString()).to.be.equal("0");
    });
  });

  describe("Portfolio Update", () => {
    it("After withdraw some amount of token, portfolio should update (first withdraw)", async () => {
      await time.increase(time.duration.seconds(TIME_BETWEEN_PORTIONS));
      await sale.withdraw({ from: user1 });

      let investment = await portfolio.getInvestment(0, { from: user1 });

      expect(investment.isPortionWithdrawn).to.be.an("array");
      expect(investment.isPortionWithdrawn[0]).to.be.true;
    });

    it("After withdraw some amount of token, portfolio should update (second withdraw)", async () => {
      await time.increase(time.duration.seconds(TIME_BETWEEN_PORTIONS));
      await sale.withdraw({ from: user1 });

      let investment = await portfolio.getInvestment(0, { from: user1 });

      expect(investment.isPortionWithdrawn).to.be.an("array");
      expect(investment.isPortionWithdrawn[1]).to.be.true;
    });

    it("After withdraw some amount of token, portfolio should update (third withdraw)", async () => {
      await time.increase(time.duration.seconds(TIME_BETWEEN_PORTIONS));
      await sale.withdraw({ from: user1 });

      let investment = await portfolio.getInvestment(0, { from: user1 });

      expect(investment.isPortionWithdrawn).to.be.an("array");
      expect(investment.isPortionWithdrawn[2]).to.be.true;
    });

    it("After withdraw some amount of token, portfolio should update (last withdraw)", async () => {
      await time.increase(time.duration.seconds(TIME_BETWEEN_PORTIONS));
      await sale.withdraw({ from: user1 });

      let investment = await portfolio.getInvestment(0, { from: user1 });

      expect(investment.isPortionWithdrawn).to.be.an("array");
      expect(investment.isPortionWithdrawn[3]).to.be.true;
    });

    it("After all withdraw should isFinished equals to true", async () => {
      let investment = await portfolio.getInvestment(0, { from: user1 });

      expect(investment.isFinished).to.be.true;
    });
  });
});
