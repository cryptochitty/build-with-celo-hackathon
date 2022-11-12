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
    const ID = 10000000;
    const [owner, account1, account2, account3] = await ethers.getSigners();
    const EventMgr = await hre.ethers.getContractFactory("EventManager");
    const eventMgr = await EventMgr.deploy(owner.address);
    return { ID, eventMgr, owner, account1, account2, account3};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { ID, eventMgr, owner } = await loadFixture(deployEventManagerFixture);
      expect(await eventMgr.owners(owner.address)).to.equal(true);
    
    });

    it("check account1 ownership should fail", async function () {
      const { ID, eventMgr, account1 } = await loadFixture(deployEventManagerFixture);
      expect(await eventMgr.owners(account1.address)).to.equal(false);
    });

    it("Add add account1 as owner and ownership test pass. account2 should fail", async function () {
      const { ID, eventMgr, account1, account2 } = await loadFixture(deployEventManagerFixture);
      await eventMgr.addOwner(account1.address)
      expect(await eventMgr.owners(account1.address)).to.equal(true);
      expect(await eventMgr.owners(account2.address)).to.equal(false);
    });


    it("register event for past month should fail", async function () {
      const { eventMgr, account1, account2 } = await loadFixture(deployEventManagerFixture);
      const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
      const prevMonth = Math.round(Date.now() / 1000) - ONE_MONTH_IN_SECS
      await expect(eventMgr.registerEvent("Test Event", account2.address, prevMonth)).to.be.revertedWith(
        "can only organize event for a future date"
      );
    });

    it("register event for next month", async function () {
      const { ID, eventMgr, account1} = await loadFixture(deployEventManagerFixture);
      const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
      const eventTimeNextMonth = Math.round(Date.now() / 1000) + ONE_MONTH_IN_SECS
      expect(await eventMgr.nextId()).to.equal(ID);
      await eventMgr.registerEvent("Test Event", account1.address, eventTimeNextMonth);
      expect(await eventMgr.nextId()).to.equal(ID + 1);
      const existingEvent = await eventMgr.getEvent(ID)
      expect(existingEvent.name).to.equal('Test Event');
      expect(existingEvent.eventOwner).to.equal(account1.address);
      expect(existingEvent.mintStatus).to.equal(false);
      expect(existingEvent.approved).to.equal(false);
      expect(existingEvent.eventDate).to.equal(eventTimeNextMonth);
    });

    it("register event for next month and approve", async function () {
      const { ID, eventMgr, account1} = await loadFixture(deployEventManagerFixture);
      const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
      const eventTimeNextMonth = Math.round(Date.now() / 1000) + ONE_MONTH_IN_SECS

      expect(await eventMgr.nextId()).to.equal(ID);
      await eventMgr.registerEvent("Test Event", account1.address, eventTimeNextMonth);
      expect(await eventMgr.nextId()).to.equal(ID + 1);

      const existingEvent = await eventMgr.getEvent(ID)
      expect(existingEvent.approved).to.equal(false);

      await expect(eventMgr.getApprovedEvent(ID)).to.be.revertedWith(
        "Event does not exist or is not approved"
      );

      expect(await eventMgr.approveEvent(ID))

      await expect(eventMgr.getEvent(ID)).to.be.revertedWith(
        "Event does not exist or already approved"
      );

      const approvedEvent = await eventMgr.getApprovedEvent(ID)
      expect(approvedEvent.approved).to.equal(true);

    });
  });  
});
