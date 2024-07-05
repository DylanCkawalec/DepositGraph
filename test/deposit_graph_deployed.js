const DepositGraph = artifacts.require("DepositGraph");

contract("DepositGraph (Deployed)", (accounts) => {
  let depositGraph;
  const admin = accounts[0];

  before(async () => {
    // Get the deployed instance
    depositGraph = await DepositGraph.deployed();
  });

  // Add your test cases here
  // ...
});