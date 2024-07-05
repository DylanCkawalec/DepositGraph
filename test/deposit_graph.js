const { expect } = require("chai");
const { ethers } = require("ethers");

const DepositGraph = artifacts.require("DepositGraph");

contract("DepositGraph", (accounts) => {
  let depositGraph;
  const admin = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  before(async () => {
    depositGraph = await DepositGraph.new(admin);
  });

  it("should set the admin correctly", async () => {
    const contractAdmin = await depositGraph.admin();
    expect(contractAdmin).to.equal(admin);
  });

  it("should sign up users", async () => {
    await depositGraph.signUp({ from: user1 });
    const userCount = await depositGraph.userCount();
    const userIndex = await depositGraph.addressToIndex(user1);
    expect(userCount.toNumber()).to.equal(1);
    expect(userIndex.toNumber()).to.equal(1);

    await depositGraph.signUp({ from: user2 });
    const userCount2 = await depositGraph.userCount();
    const userIndex2 = await depositGraph.addressToIndex(user2);
    expect(userCount2.toNumber()).to.equal(2);
    expect(userIndex2.toNumber()).to.equal(2);
  });

  it("should not allow the same user to sign up twice", async () => {
    await expect(depositGraph.signUp({ from: user1 }))
      .to.be.revertedWith("User already signed up");
  });

  it("should allow users to deposit ETH and update shares", async () => {
    const depositAmount = ethers.utils.parseEther("1");
    await depositGraph.deposit({ from: user1, value: depositAmount });
    const userShares = await depositGraph.shares(user1);
    expect(userShares.toNumber()).to.equal(100000);
  });

  it("should allow users to withdraw ETH and update shares", async () => {
    const withdrawShares = 50000;
    await depositGraph.withdraw(withdrawShares, { from: user1 });
    const userShares = await depositGraph.shares(user1);
    expect(userShares.toNumber()).to.equal(50000);

    const userBalance = await web3.eth.getBalance(user1);
    expect(parseFloat(userBalance)).to.be.above(parseFloat(ethers.utils.parseEther("0.5").toString()));
  });

  it("should not allow users to withdraw more shares than they have", async () => {
    await expect(depositGraph.withdraw(100000, { from: user1 }))
      .to.be.revertedWith("Insufficient shares");
  });

  it("should allow the admin to update shares with blobUpdate", async () => {
    const blob = "1x50000z2y100000";
    await depositGraph.blobUpdate(blob, { from: admin });

    const user1Shares = await depositGraph.shares(user1);
    const user2Shares = await depositGraph.shares(user2);

    expect(user1Shares.toNumber()).to.equal(100000);
    expect(user2Shares.toNumber()).to.equal(0);
  });

  it("should not allow non-admin users to update shares with blobUpdate", async () => {
    const blob = "1x50000z2y100000";
    await expect(depositGraph.blobUpdate(blob, { from: user1 }))
      .to.be.revertedWith("Only admin can call this function");
  });
});