import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("KYC Contracts", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  let kycContractInstance: Contract;
  let owner: any;
  let alice: any;
  let bob: any;

  async function deployKycContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, alice, bob, charlie] = await ethers.getSigners();

    const kycContract = await ethers.getContractFactory("REY_KYC");
    const kycContractInstance = await kycContract.deploy("REYield KYC", "KYC");

    return { kycContractInstance, owner, alice, bob, charlie };
  }

  beforeEach(async function () {
    const fixture = await loadFixture(deployKycContract);
    kycContractInstance = fixture.kycContractInstance;
    owner = fixture.owner;
    alice = fixture.alice;
    bob = fixture.bob;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await kycContractInstance.owner()).to.equal(owner.address);
    });
  });

  describe("Functionalities", function () {
    describe("Minting", function () {
      it("Owner should be able to mint", async function () {
        expect(await kycContractInstance.connect(owner).mint(alice.address)).to
          .not.reverted;
      });
      it("Balance of user should be 1", async function () {
        await kycContractInstance.connect(owner).mint(alice.address);
        expect(
          await kycContractInstance.connect(owner).balanceOf(alice.address)
        ).to.equal(ethers.utils.parseUnits("1", 0));
      });
      it("Cannot mint more than 1 to same wallet", async function () {
        expect(
          await kycContractInstance.connect(owner).balanceOf(bob.address)
        ).to.equal(ethers.utils.parseUnits("0", 0));

        await kycContractInstance.connect(owner).mint(bob.address);

        expect(
          await kycContractInstance.connect(owner).balanceOf(bob.address)
        ).to.equal(ethers.utils.parseUnits("1", 0));

        await expect(
          kycContractInstance.connect(owner).mint(bob.address)
        ).to.revertedWith("You already have a token");
      });
      it("Alice trying to mint should revert", async function () {
        await expect(kycContractInstance.connect(alice).mint(bob.address)).to.be
          .reverted;
        expect(
          await kycContractInstance.connect(alice).balanceOf(bob.address)
        ).to.equal(ethers.utils.parseUnits("0", 0));
      });
    });
    describe("Status Modification", function () {
      describe("KYC Status", function () {
        it("Owner Should be able to enable and disable KYC", async function () {
          await kycContractInstance.connect(owner).mint(alice.address);

          expect(
            await kycContractInstance.connect(owner).kycStatus(alice.address)
          ).to.be.true;

          await kycContractInstance.connect(owner).disableKYC(alice.address);

          expect(
            await kycContractInstance.connect(owner).kycStatus(alice.address)
          ).to.be.false;
        });
        it("Alice Shouldn't be able to enable and disable KYC", async function () {
          await kycContractInstance.connect(owner).mint(alice.address);

          await expect(
            kycContractInstance.connect(alice).disableKYC(alice.address)
          ).to.be.reverted;
        });
      });
      describe("Max Supply", function () {
        it("Owner Should be able to change Max Supply", async function () {
          expect(
            await kycContractInstance.connect(owner).maxSupply()
          ).to.be.equal(ethers.utils.parseUnits("100", 0));

          await kycContractInstance
            .connect(owner)
            .modifyMaxSupply(ethers.utils.parseUnits("200", 0));

          expect(
            await kycContractInstance.connect(owner).maxSupply()
          ).to.be.equal(ethers.utils.parseUnits("200", 0));
        });
        it("Alice Shouldn't be able to change Max Supply", async function () {
          expect(
            await kycContractInstance.connect(alice).maxSupply()
          ).to.be.equal(ethers.utils.parseUnits("100", 0));

          await expect(
            kycContractInstance
              .connect(alice)
              .modifyMaxSupply(ethers.utils.parseUnits("200", 0))
          ).to.be.reverted;
        });
      });
    });
  });

  describe("Transfers", function () {
    it("TransferFrom should revert", async function () {
      await kycContractInstance.connect(owner).mint(owner.address);
      expect(
        await kycContractInstance.connect(owner).balanceOf(owner.address)
      ).to.be.equal(ethers.utils.parseUnits("1", 0));

      expect(await kycContractInstance.connect(owner).ownerOf(1)).to.be.equal(
        owner.address
      );

      await expect(
        kycContractInstance
          .connect(owner)
          .transferFrom(owner.address, bob.address, 1)
      ).to.be.reverted;
    });

    it("safeTransferFrom should revert", async function () {
      await kycContractInstance.connect(owner).mint(owner.address);
      expect(
        await kycContractInstance.connect(owner).balanceOf(owner.address)
      ).to.be.equal(ethers.utils.parseUnits("1", 0));

      expect(await kycContractInstance.connect(owner).ownerOf(1)).to.be.equal(
        owner.address
      );

      await expect(
        kycContractInstance["safeTransferFrom(address,address,uint256)"](
          owner.address,
          bob.address,
          1
        )
      ).to.be.reverted;

      await expect(
        kycContractInstance["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          bob.address,
          1,
          "0x"
        )
      ).to.be.reverted;
    });
  });

  describe("Events", function () {
    it("Should emit an event on minting", async function () {
      await expect(
        kycContractInstance.connect(owner).mint(bob.address)
      ).to.emit(kycContractInstance, "Mint");
    });
    it("Should emit an event on kyc status change", async function () {
      await kycContractInstance.connect(owner).mint(bob.address);

      await expect(
        kycContractInstance.connect(owner).disableKYC(bob.address)
      ).to.emit(kycContractInstance, "kycStatusChange");

      await expect(
        kycContractInstance.connect(owner).enableKYC(bob.address)
      ).to.emit(kycContractInstance, "kycStatusChange");
    });
  });
});
