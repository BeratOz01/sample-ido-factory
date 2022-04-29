// Contracts Artifacts
const Factory = artifacts.require("Factory");
const Sale = artifacts.require("Sale");
const Payment = artifacts.require("PaymentToken");
const ProjectToken = artifacts.require("ProjectToken");

// Imports
const { time } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const chai = require("chai");
const ChaiTruffle = require("chai-truffle");
const truffleAssert = require("truffle-assertions");
const BN = require("bn.js");

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

contract("Factory Contract", async (accounts) => {
  let factory,
    payment,
    project,
    sale,
    owner = accounts[0],
    user1 = accounts[1],
    user2 = accounts[2];

  before(async () => {
    // Deploy Factory contract
    factory = await Factory.deployed();
    payment = await Payment.deployed();
    project = await ProjectToken.deployed();
  });

  describe("Deploy & Contract Initialization", () => {
    it("Should deploy successfully", async () => {
      let address = factory.address;

      expect(address).to.not.be.undefined;
      expect(address).to.not.equal("");
      expect(address).to.not.equal(0x0);
    });

    it("Should initialize correctly", async () => {
      let salesLength = await factory.getSalesLength();
      let paymentToken = await factory.paymentToken();
      let saleCounter = await factory.saleCounter();

      expect(saleCounter.toString()).to.be.equal("0");
      expect(paymentToken).to.be.equal(payment.address);
      expect(salesLength.toString()).to.be.equal("0");
    });
  });

  describe("Sale Creation", () => {
    it("Everyone can create new sale with valid parameters", async () => {
      await factory.createSale(
        SALE_NAME,
        NUMBER_OF_PORTIONS,
        TIME_BETWEEN_PORTIONS,
        PRICE,
        project.address,
        { from: user1 }
      );

      let newCounter = await factory.saleCounter();
      expect(newCounter.toString()).to.be.equal("1");
    });

    it("After creating new sale, sale should be created correctly", async () => {
      let users1sSales = await factory.getMySales({ from: user1 });

      expect(users1sSales.length).to.be.equal(1);
      expect(users1sSales.length).not.to.be.equal(0);
    });

    it("After creating new sale, sale counter should be increment by 1", async () => {
      let newCounter = await factory.saleCounter();
      expect(newCounter.toString()).to.be.equal("1");
    });
  });

  describe("Sale Contract Initialization", () => {
    it("Should initialize correctly", async () => {
      let counter = await factory.saleCounter();
      let infoSale = await factory.getSale(parseInt(counter) - 1);

      sale = await Sale.at(infoSale.saleAddress);
    });

    it("Should set contract successfully", async () => {
      const address = sale.address;

      expect(address).to.not.be.undefined;
      expect(address).to.not.equal("");
      expect(address).to.not.equal(0x0);
    });

    it("Should set contract name correctly", async () => {
      let name = await sale.name();
      expect(name).to.be.equal(SALE_NAME);
    });

    it("Should set contract price correctly", async () => {
      let price = await sale.price();
      expect(price.toString()).to.be.equal(PRICE);
    });

    it("Should set contract numberOfPortions correctly", async () => {
      let numberOfPortions = await sale.numberOfPortions();
      expect(numberOfPortions.toString()).to.be.equal(
        NUMBER_OF_PORTIONS.toString()
      );
    });

    it("Should set contract timeBetweenPortions correctly", async () => {
      let timeBetweenPortions = await sale.timeBetweenPortions();
      expect(timeBetweenPortions.toString()).to.be.equal(
        TIME_BETWEEN_PORTIONS.toString()
      );
    });

    it("Should set contract paymentToken correctly", async () => {
      let paymentToken = await sale.paymentToken();
      expect(paymentToken).to.be.equal(payment.address);
    });

    it("Should set contract projectToken correctly", async () => {
      let projectToken = await sale.projectToken();
      expect(projectToken).to.be.equal(project.address);
    });

    it("Should set contract admin correctly", async () => {
      let admin = await sale.admin();
      expect(admin).to.be.equal(user1);
    });

    it("Should set distribution dates", async () => {
      let dates = await sale.getDistributionDates();
      expect(dates.length).to.be.equal(NUMBER_OF_PORTIONS);
    });
  });

  describe("Payment Token Request", () => {
    it("User2 request payment token for test cases", async () => {
      await payment.requestPaymentToken({ from: user2 });

      let balance = await payment.balanceOf(user2);
      expect(balance.toString()).to.be.equal(toWei(10));
    });

    it("User1 request payment token for test cases", async () => {
      await payment.requestPaymentToken({ from: user1 });

      let balance = await payment.balanceOf(user1);
      expect(balance.toString()).to.be.equal(toWei(10));
    });

    it("Admin transfer 50 Ether to user2", async () => {
      await payment.transfer(user2, toWei(50), { from: owner });

      let balance = await payment.balanceOf(user2);
      expect(balance.toString()).to.be.equal(toWei(60));
    });
  });

  describe("Sale Contract - Buy", () => {
    it("User needs to send between minimum and maximum distribution amount otherwise contract will throw an error (minimum error)", async () => {
      let amount = toWei(0.1);
      await truffleAssert.reverts(
        sale.buy(amount, { from: user2 }),
        "Amount should be between minimum and maximum amount of payment token"
      );
    });

    it("User needs to send between minimum and maximum distribution amount otherwise contract will throw an error (maximum error)", async () => {
      let amount = toWei(1000000);

      await truffleAssert.reverts(
        sale.buy(amount, { from: user2 }),
        "Amount should be between minimum and maximum amount of payment token"
      );
    });

    it("User needs to approve to sale contract , enough token for transfer", async () => {
      let amount = toWei(50);
      await payment.approve(sale.address, amount, { from: user2 });

      let allowance = await payment.allowance(user2, sale.address, {
        from: user2,
      });
      expect(allowance.toString()).to.be.equal(amount.toString());
    });

    it("User buy only if sale address has enough project token", async () => {
      let amountInPaymentToken = toWei(5);
      await truffleAssert.reverts(
        sale.buy(amountInPaymentToken, { from: user2 }),
        "Not enough tokens for distribution."
      );
    });

    it("Owner needs to send enough project token to sale contract", async () => {
      let amount = toWei(150);
      await project.transfer(sale.address, amount, { from: owner });

      let balance = await project.balanceOf(sale.address);
      expect(balance.toString()).to.be.equal(amount.toString());
    });

    it("User can buy and receive correct amount of project token", async () => {
      let amountInPaymentToken = toWei(5);
      await sale.buy(amountInPaymentToken, { from: user2 });
    });

    it("User only participate once for every sale", async () => {
      await truffleAssert.reverts(
        sale.buy(toWei(5), { from: user2 }),
        "User already participated in this sale."
      );
    });

    it("Contract must be set Participant struct correctly", async () => {
      let expectedInProjectToken = toWei(5) / PRICE;
      let infoArr = await sale.getInfo__sender({ from: user2 });

      // Local variable for check sum of balance
      let sum = 0;

      for (let portion of infoArr) {
        sum += parseInt(portion.amount);
      }

      expect(sum.toString()).to.be.equal(toWei(expectedInProjectToken));
    });
  });

  describe("Sale Contract - Withdraw", () => {
    it("User can withdraw only if unlocked", async () => {
      await truffleAssert.reverts(
        sale.withdraw({ from: user2 }),
        "Nothing to withdraw"
      );
    });

    it("Should pass enough time for withdraw first portion", async () => {
      await time.increase(time.duration.seconds(TIME_BETWEEN_PORTIONS));
      await sale.withdraw({ from: user2 });
    });

    it("After withdraw first portion, user needs to have correct project token", async () => {
      let balanceOf = await project.balanceOf(user2);
      let expectedOutput = toWei(5) / (PRICE * NUMBER_OF_PORTIONS);

      expect(balanceOf.toString()).to.be.equal(toWei(expectedOutput));
    });

    it("Info array should set correctly", async () => {
      let infoArr = await sale.getInfo__sender({ from: user2 });

      expect(infoArr[0].isClaimed).to.be.true;
    });

    it("After withdraw first portion, user needs to wait another TIME_BETWEEN_PORTION seconds for withdraw second portion", async () => {
      await truffleAssert.reverts(
        sale.withdraw({ from: user2 }),
        "Nothing to withdraw"
      );
    });

    it("After wait enough time, user can withdraw second portion", async () => {
      await time.increase(time.duration.seconds(TIME_BETWEEN_PORTIONS));
      await sale.withdraw({ from: user2 });
    });
  });
});
