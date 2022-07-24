import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SendTransactionError,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { expect } from "chai";
import { GrantsProgram } from "../../target/types/grants_program";
import { makeDonation } from "../../app/src/transactions";
import { toBytesInt32 } from "../../app/src/utils/conversion";

export default function donations() {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  
  // to be initialized in the `before` method from the context
  let program: Program<GrantsProgram>;
  let programInfoPDA: PublicKey;
  let admin: Keypair;
  let generateFundedKeypair: () => Promise<Keypair>;

  // to be initialized in the `beforeEach` method
  let author: Keypair;
  let grantPDA: PublicKey;

  before(async function() {
    program = this.test.ctx.program;
    programInfoPDA = this.test.ctx.programInfoPDA;
    admin = this.test.ctx.admin;
    generateFundedKeypair = this.test.ctx.generateFundedKeypair;
  });

  beforeEach(async () => {
    author = await generateFundedKeypair();
    grantPDA = await createGrant(author);
  });

  async function createDonation(
    grant: PublicKey,
    donor: Keypair,
    lamports: number
  ): Promise<PublicKey> {
    // donationPDA with grant key + donor key
    const [donationPDA, _bump0] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation"), grant.toBuffer(), donor.publicKey.toBuffer()],
        program.programId
      );

    // donationIndexPDA with grant key + latest donor count
    const totalDonors = (await program.account.grant.fetch(grant)).totalDonors;
    const [donationIndexPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation_index"), grant.toBuffer(), toBytesInt32(totalDonors)],
        program.programId
      );

    try {
      const _tx = await program.methods
        .createDonation(lamports)
        .accounts({
          payer: donor.publicKey,
          grant,
          donation: donationPDA,
          donationIndex: donationIndexPDA,
        })
        .signers([donor])
        .rpc();
    } catch (err) {
      console.log(err);
      expect.fail();
    }

    return donationPDA;
  }

  async function createGrant(author: Keypair) {
    const targetLamports = LAMPORTS_PER_SOL;
    const dueDate = 123124;
    const info = "";

    const programInfo = await program.account.programInfo.fetch(programInfoPDA);
    const [newGrantPDA, _grantBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("grant"), toBytesInt32(programInfo.grantsCount)],
        program.programId
      );

    try {
      await program.methods
        .createGrant(info, targetLamports, dueDate)
        .accounts({
          grant: newGrantPDA,
          programInfo: programInfoPDA,
          author: author.publicKey,
        })
        .signers([author])
        .rpc();
    } catch (err) {
      console.log(err);
      expect.fail();
    }

    return newGrantPDA;
  }

  it("Creates a grant!", async () => {
    author = await generateFundedKeypair();
    await createGrant(author);
  });

  it("Creates a donation", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const initialGrantBalance = await provider.connection.getBalance(grantPDA);

    // Act
    const donationPDA = await createDonation(grantPDA, donor, lamports);

    // Assert
    let donation = await program.account.donation.fetch(donationPDA);
    const grantBalance = await provider.connection.getBalance(grantPDA);

    expect(donation.payer).to.eql(donor.publicKey);
    expect(donation.grant).to.eql(grantPDA);
    expect(donation.amount.toNumber()).to.eq(lamports);
    expect(donation.state).to.eql({ funded: {} });
    expect(grantBalance).to.eql(initialGrantBalance + lamports);
  });

  it("Releases the grant funds to the author", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const _donationPDA = await createDonation(grantPDA, donor, lamports);

    const initialGrantBalance = await provider.connection.getBalance(grantPDA);
    const initialAuthorBalance = await provider.connection.getBalance(
      author.publicKey
    );

    // Act
    const _tx = await program.methods
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

    expect(grant.lamportsRaised.toNumber()).to.eql(lamports);
    expect(grant.state).to.eql({ released: {} });
    expect(grantBalance).to.eql(initialGrantBalance - lamports);
    expect(authorBalance).to.eql(initialAuthorBalance + lamports);
  });

  it("Fails when trying to release same grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const _donationPDA = await createDonation(grantPDA, donor, lamports);

    const _tx = await program.methods
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
    expect(grant.state).to.eql({ released: {} });

    // Act
    try {
      const _tx = await program.methods
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
      expect(err.error.errorCode.number).to.equal(6002);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("Cannot create another donation account with same user and grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const donationPDA = await createDonation(
      grantPDA,
      donor,
      2.4 * LAMPORTS_PER_SOL
    );

    const [donationIndexPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation_index"), grantPDA.toBuffer(), Buffer.from([1])],
        program.programId
      );

    try {
      // Act
      const _tx = await program.methods
        .createDonation(0.7 * LAMPORTS_PER_SOL)
        .accounts({
          payer: donor.publicKey,
          donation: donationPDA,
          donationIndex: donationIndexPDA,
          grant: grantPDA,
        })
        .signers([donor])
        .rpc();

      // Assert
      expect.fail("This should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(SendTransactionError);
    }
  });

  it("Creates another donation with other user", async () => {
    const donor1 = await generateFundedKeypair();
    await createDonation(grantPDA, donor1, 2.1 * LAMPORTS_PER_SOL);

    const donor2 = await generateFundedKeypair();
    await createDonation(grantPDA, donor2, 2.1 * LAMPORTS_PER_SOL);
  });

  it("Cancels a donation", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 2.1 * LAMPORTS_PER_SOL;
    const donationPDA = await createDonation(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    const initialGrantBalance = await provider.connection.getBalance(grantPDA);
    const initialDonorBalance = await provider.connection.getBalance(payer);

    // Act
    const _tx = await program.methods
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

    expect(grantBalance).to.be.eql(initialGrantBalance - lamports);
    expect(donorBalance).to.be.eql(initialDonorBalance + lamports);
    expect(donation.state).to.eql({ cancelled: {} });
  });

  it("Fails when trying to cancel an already cancelled donation", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 2.1 * LAMPORTS_PER_SOL;
    const donationPDA = await createDonation(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    const _tx = await program.methods
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
      const _tx = await program.methods
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

  it("Same user and grant can increment the donation amount", async () => {
    // Arrange
    const donor = await generateFundedKeypair();

    const donationPDA = await createDonation(
      grantPDA,
      donor,
      1 * LAMPORTS_PER_SOL
    );

    // Act
    const _tx = await program.methods
      .incrementDonation(1 * LAMPORTS_PER_SOL)
      .accounts({
        donation: donationPDA,
        payer: donor.publicKey,
        grant: grantPDA,
      })
      .signers([donor])
      .rpc();

    // Assert
    const donation = await program.account.donation.fetch(donationPDA);
    const grantBalance = await provider.connection.getBalance(grantPDA);

    expect(donation.state).to.eql({ funded: {} });
    expect(grantBalance).to.be.above(2 * LAMPORTS_PER_SOL);
  });

  it("Donations can be fetched when we only know the grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();

    const totalDonors = (await program.account.grant.fetch(grantPDA))
      .totalDonors;

    const donationPDA = await createDonation(
      grantPDA,
      donor,
      1 * LAMPORTS_PER_SOL
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
      const lamports = 2.1 * LAMPORTS_PER_SOL;

      // Act
      let transaction = await makeDonation(donor.publicKey, grantPDA, lamports);
      const _txSignature = await provider.sendAndConfirm(transaction, [donor]);

      // Assert
      const [donationPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation"), grantPDA.toBuffer(), donor.publicKey.toBuffer()],
        program.programId
      );
      const donation = await program.account.donation.fetch(donationPDA);

      expect(donation.state).to.eql({ funded: {} });
      expect(donation.amount.toNumber()).to.eql(lamports);
    });

    it("increments an existing donation", async () => {
      // Arrange
      // make first donation
      const donor = await generateFundedKeypair();
      const lamports = 2.1 * LAMPORTS_PER_SOL;

      let transaction = await makeDonation(donor.publicKey, grantPDA, lamports);
      let _txSignature = await provider.sendAndConfirm(transaction, [donor]);

      // Act
      // make second donation
      transaction = await makeDonation(donor.publicKey, grantPDA, lamports);
      _txSignature = await provider.sendAndConfirm(transaction, [donor]);

      // Assert
      // fetch the donation
      const [donationPDA, _bump0] =
        await anchor.web3.PublicKey.findProgramAddress(
          [encode("donation"), grantPDA.toBuffer(), donor.publicKey.toBuffer()],
          program.programId
        );
      const donation = await program.account.donation.fetch(donationPDA);

      expect(donation.state).to.eql({ funded: {} });
      expect(donation.amount.toNumber()).to.eql(2 * lamports);
    });
  });
}
