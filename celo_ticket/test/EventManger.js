const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("EventManager", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEventManagerFixture() {
   // deploy a Event manager contract
    const [owner, account1, account2, account3] = await ethers.getSigners();
    const EventMgr = await hre.ethers.getContractFactory("EventManager");
    const eventMgr = await EventMgr.deploy(owner.address);
    return {eventMgr, owner, account1, account2, account3};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { eventMgr, owner } = await loadFixture(deployEventManagerFixture);
      expect(await eventMgr.owners(owner.address)).to.equal(true);
    
    });

    it("Assert wrong ownership", async function () {
      const { eventMgr, account1 } = await loadFixture(deployEventManagerFixture);
      expect(await eventMgr.owners(account1.address)).to.equal(false);
    });

    it("Add new ownership", async function () {
      const { eventMgr, account1, account2 } = await loadFixture(deployEventManagerFixture);
      await eventMgr.addOwner(account1.address)
      expect(await eventMgr.owners(account1.address)).to.equal(true);
      expect(await eventMgr.owners(account2.address)).to.equal(false);
    });
  });  
});
