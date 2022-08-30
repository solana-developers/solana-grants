import * as anchor from "@project-serum/anchor";
import { AnchorError, BN, Program } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SendTransactionError,
} from "@solana/web3.js";
import { assert, expect } from "chai";
import { processed } from "../../app/src/constants";
import { GrantsProgram } from "../../app/src/idl/grants_program";
import getProgram from "../../app/src/instructions/api/getProgram";
import { makeDonation, cancelGrant } from "../../app/src/transactions";
import { toBytesInt32 } from "../../app/src/utils/conversion";
import { matchedDonation } from "../grants-program";

export default function donations() {
  // to be initialized in the `before` method from the context
  let provider: anchor.Provider;
  let program: Program<GrantsProgram>;
  let programInfoPDA: PublicKey;
  let admin: Keypair;
  let generateFundedKeypair: () => Promise<Keypair>;
  let createGrant: (author: Keypair) => Promise<PublicKey>;
  let createGrantWithDueDate: (
    author: Keypair,
    dueDate: number
  ) => Promise<PublicKey>;

  // to be initialized in the `beforeEach` method
  let author: Keypair;
  let grantPDA: PublicKey;

  before(async function () {
    provider = this.test.ctx.provider;
    program = this.test.ctx.program;
    programInfoPDA = this.test.ctx.programInfoPDA;
    admin = this.test.ctx.admin;
    generateFundedKeypair = this.test.ctx.generateFundedKeypair;
    createGrant = this.test.ctx.createGrant;
    createGrantWithDueDate = this.test.ctx.createGrantWithDueDate;

    // put some money on the matching account
    await provider.connection.requestAirdrop(
      programInfoPDA,
      100 * LAMPORTS_PER_SOL
    );
  });

  beforeEach(async () => {
    author = await generateFundedKeypair();
    grantPDA = await createGrant(author);

    // Set matching eligibility to true
    await program.methods
      .eligibleMatching()
      .accounts({
        admin: admin.publicKey,
        programInfo: programInfoPDA,
        grant: grantPDA,
      })
      .signers([admin])
      .rpc();
  });

  async function createDonation(
    grantPDA: PublicKey,
    donor: Keypair,
    lamports: BN
  ): Promise<PublicKey> {
    // donationPDA with grant key + donor key
    const [donationPDA, _bump0] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation"), grantPDA.toBuffer(), donor.publicKey.toBuffer()],
        program.programId
      );

    // donationIndexPDA with grant key + latest donor count
    const totalDonors = (await program.account.grant.fetch(grantPDA))
      .totalDonors;
    const [donationIndexPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          encode("donation_index"),
          grantPDA.toBuffer(),
          toBytesInt32(totalDonors),
        ],
        program.programId
      );

    const [matchingDonationPDA, _bump2] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("matching_donation"), grantPDA.toBuffer()],
        program.programId
      );

    try {
      await program.methods
        .createDonation(lamports)
        .accounts({
          payer: donor.publicKey,
          grant: grantPDA,
          donation: donationPDA,
          donationIndex: donationIndexPDA,
          matchingDonation: matchingDonationPDA,
          programInfo: programInfoPDA,
        })
        .signers([donor])
        .rpc();
    } catch (err) {
      // console.info(err); // uncomment to see the error
      throw err;
    }

    return donationPDA;
  }

  it("creates a donation", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = new BN(0.7 * LAMPORTS_PER_SOL);
    const initialGrantBalance = await provider.connection.getBalance(grantPDA);

    // Act
    const donationPDA = await createDonation(grantPDA, donor, lamports);

    // Assert
    let donation = await program.account.donation.fetch(donationPDA);
    const grantBalance = await provider.connection.getBalance(grantPDA);

    expect(donation.payer).to.eql(donor.publicKey);
    expect(donation.grant).to.eql(grantPDA);
    assert(donation.amount.eq(lamports));
    expect(donation.state).to.eql({ funded: {} });
    expect(grantBalance).to.eql(
      initialGrantBalance +
        lamports.toNumber() +
        matchedDonation(lamports.toNumber())
    );
  });

  it("releases the grant funds to the author", async () => {
    // Arrange
    const initialGrantBalance = await provider.connection.getBalance(grantPDA);
    const initialAuthorBalance = await provider.connection.getBalance(
      author.publicKey
    );
    const donor = await generateFundedKeypair();
    const lamports = new BN(0.7 * LAMPORTS_PER_SOL);
    await createDonation(grantPDA, donor, lamports);

    // Act
    await program.methods
      .releaseGrant()
      .accounts({
        admin: admin.publicKey,
        author: author.publicKey,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .signers([admin])
      .rpc();

    // Assert
    const grantBalance = await provider.connection.getBalance(grantPDA);
    const authorBalance = await provider.connection.getBalance(
      author.publicKey
    );
    const grant = await program.account.grant.fetch(grantPDA);

    expect(grant.fundingState).to.eql({ released: {} });
    expect(grantBalance).to.eql(initialGrantBalance);
    expect(authorBalance).to.eql(
      initialAuthorBalance +
        lamports.toNumber() +
        matchedDonation(lamports.toNumber())
    );
  });

  it("fails when trying to release same grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = new BN(0.7 * LAMPORTS_PER_SOL);
    const _donationPDA = await createDonation(grantPDA, donor, lamports);

    await program.methods
      .releaseGrant()
      .accounts({
        admin: admin.publicKey,
        author: author.publicKey,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .signers([admin])
      .rpc();

    const grant = await program.account.grant.fetch(grantPDA);
    expect(grant.fundingState).to.eql({ released: {} });

    // Act
    try {
      await program.methods
        .releaseGrant()
        .accounts({
          admin: admin.publicKey,
          author: author.publicKey,
          grant: grantPDA,
          programInfo: programInfoPDA,
        })
        .signers([admin])
        .rpc();

      // Assert
      expect.fail("Should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal("ReleasedGrant");
      expect(err.error.errorCode.number).to.equal(6001);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("fails when trying to release a cancelled grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = new BN(0.7 * LAMPORTS_PER_SOL);
    const _donationPDA = await createDonation(grantPDA, donor, lamports);

    await program.methods
      .cancelGrantAdmin()
      .accounts({
        admin: admin.publicKey,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .signers([admin])
      .rpc();

    const grant = await program.account.grant.fetch(grantPDA);
    expect(grant.fundingState).to.eql({ cancelled: {} });

    // Act
    try {
      await program.methods
        .releaseGrant()
        .accounts({
          admin: admin.publicKey,
          author: author.publicKey,
          grant: grantPDA,
          programInfo: programInfoPDA,
        })
        .signers([admin])
        .rpc();

      // Assert
      expect.fail("Should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal("CancelledGrant");
      expect(err.error.errorCode.number).to.equal(6002);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("cannot create another donation account with same user and grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const donationPDA = await createDonation(
      grantPDA,
      donor,
      new BN(2.4 * LAMPORTS_PER_SOL)
    );

    const [donationIndexPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation_index"), grantPDA.toBuffer(), Buffer.from([1])],
        program.programId
      );

    const [matchingDonationPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("matching_donation"), grantPDA.toBuffer()],
        program.programId
      );

    try {
      // Act
      await program.methods
        .createDonation(new BN(0.7 * LAMPORTS_PER_SOL))
        .accounts({
          payer: donor.publicKey,
          donation: donationPDA,
          donationIndex: donationIndexPDA,
          grant: grantPDA,
          matchingDonation: matchingDonationPDA,
          programInfo: programInfoPDA,
        })
        .signers([donor])
        .rpc();

      // Assert
      expect.fail("This should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(SendTransactionError);
    }
  });

  it("creates another donation with other user", async () => {
    const donor1 = await generateFundedKeypair();
    await createDonation(grantPDA, donor1, new BN(2.1 * LAMPORTS_PER_SOL));

    const donor2 = await generateFundedKeypair();
    await createDonation(grantPDA, donor2, new BN(2.1 * LAMPORTS_PER_SOL));
  });

  it("cancels a donation", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = new BN(2.1 * LAMPORTS_PER_SOL);
    const donationPDA = await createDonation(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    const initialGrantBalance = await provider.connection.getBalance(grantPDA);
    const initialDonorBalance = await provider.connection.getBalance(payer);

    await program.methods
      .cancelGrantAdmin()
      .accounts({
        admin: admin.publicKey,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .signers([admin])
      .rpc();

    // Act
    await program.methods
      .cancelDonation()
      .accounts({
        admin: admin.publicKey,
        programInfo: programInfoPDA,
        donation: donationPDA,
        payer,
        grant: grantPDA,
      })
      .signers([admin])
      .rpc();

    // Assert
    const donation = await program.account.donation.fetch(donationPDA);
    const grantBalance = await provider.connection.getBalance(grantPDA);
    const donorBalance = await provider.connection.getBalance(payer);

    expect(grantBalance).to.be.eql(initialGrantBalance - lamports.toNumber());
    expect(donorBalance).to.be.eql(initialDonorBalance + lamports.toNumber());
    expect(donation.state).to.eql({ cancelled: {} });
  });

  it("forbids cancelling a donation when the grant is still active", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = new BN(2.1 * LAMPORTS_PER_SOL);
    const donationPDA = await createDonation(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    // Act
    try {
      await program.methods
        .cancelDonation()
        .accounts({
          admin: admin.publicKey,
          programInfo: programInfoPDA,
          donation: donationPDA,
          payer,
          grant: grantPDA,
        })
        .signers([admin])
        .rpc();

      // Assert
      expect.fail("This should not be allowed");
    } catch (e) {
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("GrantStillActive");
      expect(err.error.errorCode.number).to.equal(6003);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  describe("When a donation is cancelled", function () {
    it("fails when trying to cancel it again", async () => {
      // Arrange
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);
      const donationPDA = await createDonation(grantPDA, donor, lamports);
      await program.methods
        .cancelGrantAdmin()
        .accounts({
          admin: admin.publicKey,
          grant: grantPDA,
          programInfo: programInfoPDA,
        })
        .signers([admin])
        .rpc();
      const payer = donor.publicKey;

      await program.methods
        .cancelDonation()
        .accounts({
          admin: admin.publicKey,
          programInfo: programInfoPDA,
          donation: donationPDA,
          payer,
          grant: grantPDA,
        })
        .signers([admin])
        .rpc();

      const donation = await program.account.donation.fetch(donationPDA);
      expect(donation.state).to.eql({ cancelled: {} });

      try {
        // Act
        await program.methods
          .cancelDonation()
          .accounts({
            admin: admin.publicKey,
            programInfo: programInfoPDA,
            donation: donationPDA,
            payer,
            grant: grantPDA,
          })
          .signers([admin])
          .rpc();

        // Assert
        expect.fail("Should've failed but didn't");
      } catch (_err) {
        expect(_err).to.be.instanceOf(AnchorError);
        const err: AnchorError = _err;
        expect(err.error.errorCode.code).to.equal("CancelledDonation");
        expect(err.error.errorCode.number).to.equal(6000);
        expect(err.program.equals(program.programId)).is.true;
      }
    });
  });

  it("fails when donating to an expired grant", async () => {
    // Arrange
    grantPDA = await createGrantWithDueDate(
      author,
      Math.floor(Date.now() / 1000) + 1
    );
    await program.methods
      .eligibleMatching()
      .accounts({
        admin: admin.publicKey,
        programInfo: programInfoPDA,
        grant: grantPDA,
      })
      .signers([admin])
      .rpc();
    const donor = await generateFundedKeypair();
    const lamports = new BN(2.1 * LAMPORTS_PER_SOL);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Act
    try {
      await createDonation(grantPDA, donor, lamports);
      expect.fail("Should've failed but didn't");
    } catch (e) {
      // Assert
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("DueDateInPast");
      expect(err.error.errorCode.number).to.equal(6004);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("same user and grant can increment the donation amount", async () => {
    // Arrange
    const donor = await generateFundedKeypair();

    const donationPDA = await createDonation(
      grantPDA,
      donor,
      new BN(1 * LAMPORTS_PER_SOL)
    );

    const [matchingDonationPDA, _bump2] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("matching_donation"), grantPDA.toBuffer()],
        program.programId
      );

    // Act
    await program.methods
      .incrementDonation(new BN(1 * LAMPORTS_PER_SOL))
      .accounts({
        donation: donationPDA,
        payer: donor.publicKey,
        grant: grantPDA,
        matchingDonation: matchingDonationPDA,
        programInfo: programInfoPDA,
      })
      .signers([donor])
      .rpc();

    // Assert
    const donation = await program.account.donation.fetch(donationPDA);
    const grantBalance = await provider.connection.getBalance(grantPDA);

    expect(donation.state).to.eql({ funded: {} });
    expect(grantBalance).to.be.above(2 * LAMPORTS_PER_SOL);
  });

  it("donations can be fetched when we only know the grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();

    const totalDonors = (await program.account.grant.fetch(grantPDA))
      .totalDonors;

    const donationPDA = await createDonation(
      grantPDA,
      donor,
      new BN(1 * LAMPORTS_PER_SOL)
    );

    const [donationIndexPDA, _] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          encode("donation_index"),
          grantPDA.toBuffer(),
          toBytesInt32(totalDonors),
        ],
        program.programId
      );

    // Act
    const donationIndex = await program.account.link.fetch(donationIndexPDA);

    // Assert
    expect(donationIndex.address).to.eql(donationPDA);
    const donation = await program.account.donation.fetch(
      donationIndex.address
    );
    expect(donation.payer).to.eql(donor.publicKey);
  });

  describe("makeDonation helper", () => {
    it("creates a new donation", async () => {
      // Arrange
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);

      const provider = new anchor.AnchorProvider(
        program.provider.connection,
        new anchor.Wallet(donor),
        { preflightCommitment: processed }
      );
      const program_ = getProgram(provider);

      // Act
      let sig = await makeDonation(
        program_,
        donor.publicKey,
        grantPDA,
        lamports
      );
      // const _txSignature = await provider.sendAndConfirm(transaction, [donor]);

      // Assert
      const [donationPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation"), grantPDA.toBuffer(), donor.publicKey.toBuffer()],
        program.programId
      );
      const donation = await program.account.donation.fetch(donationPDA);

      expect(donation.state).to.eql({ funded: {} });
      assert(donation.amount.eq(lamports));
    });

    it("increments an existing donation", async () => {
      // Arrange
      // make first donation
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);

      const provider = new anchor.AnchorProvider(
        program.provider.connection,
        new anchor.Wallet(donor),
        { preflightCommitment: processed }
      );
      const program_ = getProgram(provider);
      let transaction = await makeDonation(
        program_,
        donor.publicKey,
        grantPDA,
        lamports
      );
      // let _txSignature = await provider.sendAndConfirm(transaction, [donor]);

      // Act
      // make second donation
      transaction = await makeDonation(
        program_,
        donor.publicKey,
        grantPDA,
        lamports
      );
      // _txSignature = await provider.sendAndConfirm(transaction, [donor]);

      // Assert
      // fetch the donation
      const [donationPDA, _bump0] =
        await anchor.web3.PublicKey.findProgramAddress(
          [encode("donation"), grantPDA.toBuffer(), donor.publicKey.toBuffer()],
          program.programId
        );
      const donation = await program.account.donation.fetch(donationPDA);

      expect(donation.state).to.eql({ funded: {} });
      assert(donation.amount.eq(lamports.mul(new BN(2))));
    });
  });
  describe("cancelGrant helper", function () {
    it("cancels the grant and refunds all the grant's donors", async function () {
      // Arrange
      const initialGrantBalance = await provider.connection.getBalance(
        grantPDA
      );
      const initialMatcherBalance = await provider.connection.getBalance(
        programInfoPDA
      );

      const donor1 = await generateFundedKeypair();
      const donor2 = await generateFundedKeypair();
      const donor3 = await generateFundedKeypair();
      const lamports1 = new BN(2.1 * LAMPORTS_PER_SOL);
      const lamports2 = new BN(3.5 * LAMPORTS_PER_SOL);
      const lamports3 = new BN(4.2 * LAMPORTS_PER_SOL);
      const donation1PDA = await createDonation(grantPDA, donor1, lamports1);
      const donation2PDA = await createDonation(grantPDA, donor2, lamports2);
      const donation3PDA = await createDonation(grantPDA, donor3, lamports3);
      const initialDonor1Balance = await provider.connection.getBalance(
        donor1.publicKey
      );
      const initialDonor2Balance = await provider.connection.getBalance(
        donor2.publicKey
      );
      const initialDonor3Balance = await provider.connection.getBalance(
        donor3.publicKey
      );

      // Act
      let tx = await cancelGrant(program, grantPDA, admin.publicKey);
      try {
        await provider.sendAndConfirm(tx, [admin]);
      } catch (e) {
        console.log(e);
        expect.fail();
      }

      // Assert
      const grantBalance = await provider.connection.getBalance(grantPDA);
      const matcherBalance = await provider.connection.getBalance(
        programInfoPDA
      );
      const grant = await program.account.grant.fetch(grantPDA);
      const donation1 = await program.account.donation.fetch(donation1PDA);
      const donation2 = await program.account.donation.fetch(donation2PDA);
      const donation3 = await program.account.donation.fetch(donation3PDA);
      const donor1Balance = await provider.connection.getBalance(
        donor1.publicKey
      );
      const donor2Balance = await provider.connection.getBalance(
        donor2.publicKey
      );
      const donor3Balance = await provider.connection.getBalance(
        donor3.publicKey
      );

      expect(grant.fundingState).to.eql({ cancelled: {} });
      expect(donation1.state).to.eql({ cancelled: {} });
      expect(donation2.state).to.eql({ cancelled: {} });
      expect(donation3.state).to.eql({ cancelled: {} });

      expect(donor1Balance).to.eql(initialDonor1Balance + lamports1.toNumber());
      expect(donor2Balance).to.eql(initialDonor2Balance + lamports2.toNumber());
      expect(donor3Balance).to.eql(initialDonor3Balance + lamports3.toNumber());
      expect(grantBalance).to.eql(initialGrantBalance);
      expect(matcherBalance).to.eql(initialMatcherBalance);
    });
  });
}
