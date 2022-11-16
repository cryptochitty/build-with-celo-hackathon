const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
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

    it("Add account1 as owner, account1 ownership test pass. account2 should fail", async function () {
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
      const existingEventDetail = await eventMgr.getEvent(ID)
      expect(existingEventDetail.name).to.equal('Test Event');
      expect(existingEventDetail.eventOwner).to.equal(account1.address);
      expect(existingEventDetail.mintStatus).to.equal(false);
      expect(existingEventDetail.approved).to.equal(false);
      expect(existingEventDetail.eventDate).to.equal(eventTimeNextMonth);
    });

    it("register event for next month and approve", async function () {
      const { ID, eventMgr, account1} = await loadFixture(deployEventManagerFixture);
      const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
      const eventTimeNextMonth = Math.round(Date.now() / 1000) + ONE_MONTH_IN_SECS

      expect(await eventMgr.nextId()).to.equal(ID);
      await eventMgr.registerEvent("Test Event", account1.address, eventTimeNextMonth);
      expect(await eventMgr.nextId()).to.equal(ID + 1);

      const existingEventDetail = await eventMgr.getEvent(ID)
      expect(existingEventDetail.approved).to.equal(false);

      await expect(eventMgr.getApprovedEvent(ID)).to.be.revertedWith(
        "Event does not exist or is not approved"
      );

      expect(await eventMgr.approveEvent(ID))

      await expect(eventMgr.getEvent(ID)).to.be.revertedWith(
        "Event does not exist or already approved"
      );

      const approvedEventDetail = await eventMgr.getApprovedEvent(ID)
      expect(approvedEventDetail.approved).to.equal(true);

    });
    
    it("test case for non existing event", async function () {
      const { ID, eventMgr, account1} = await loadFixture(deployEventManagerFixture);
      await expect(eventMgr.getEvent(5)).to.be.revertedWith(
        "Event does not exist or already approved"
      );

      await expect(eventMgr.getApprovedEvent(5)).to.be.revertedWith(
        "Event does not exist or is not approved"
      );
    });
   });  
});