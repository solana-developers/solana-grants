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
import { GrantsProgram } from "../target/types/grants_program";

const toBytesInt32 = (num: number): Buffer => {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num);
  return Buffer.from(arr);
};

describe("Donations", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;
  const programWallet = (program.provider as anchor.AnchorProvider).wallet;

  // to be initialized in the `before` method
  let programInfoPDA: PublicKey;

  // to be initialized in the `beforeEach` method
  let creator: Keypair;
  let grantPDA: PublicKey;

  async function generateFundedKeypair(): Promise<anchor.web3.Keypair> {
    const newKeypair = anchor.web3.Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: programWallet.publicKey,
        toPubkey: newKeypair.publicKey,
        lamports: 5 * LAMPORTS_PER_SOL,
      })
    );
    const _confirmation = await (
      program.provider as anchor.AnchorProvider
    ).sendAndConfirm(transaction);

    return newKeypair;
  }

  async function generateDonation(
    grant: PublicKey,
    donor: Keypair,
    lamports: number
  ): Promise<PublicKey> {
    const [donationPDA, _bump0] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation"), grant.toBuffer(), donor.publicKey.toBuffer()],
        program.programId
      );

    const totalDonors = (await program.account.grant.fetch(grant)).totalDonors;
    const [donationLinkPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("donation_link"), grant.toBuffer(), toBytesInt32(totalDonors)],
        program.programId
      );

    const initialGrantBalance = await provider.connection.getBalance(grantPDA);

    try {
      const _tx = await program.methods
        .createDonation(lamports)
        .accounts({
          payer: donor.publicKey,
          grant,
          donation: donationPDA,
          donationLink: donationLinkPDA,
        })
        .signers([donor])
        .rpc();
    } catch (err) {
      console.log(err);
      expect.fail();
    }

    let donation = await program.account.donation.fetch(donationPDA);

    const grantBalance = await provider.connection.getBalance(grantPDA);

    expect(donation.payer).to.eql(donor.publicKey);
    expect(donation.grant).to.eql(grant);
    expect(donation.amount.toNumber()).to.eq(lamports);
    expect(donation.state).to.eql({ funded: {} });

    expect(grantBalance).to.eql(initialGrantBalance + lamports);

    return donationPDA;
  }

  async function generateGrant(
    creator: Keypair
  ): Promise<anchor.web3.PublicKey> {
    const [newGrantPDA, _grantBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("grant"), creator.publicKey.toBuffer()],
        program.programId
      );

    const grantInfo = {
      title: "first grant",
      description:
        "skadkfjaskdjfhaklsjdhfjklashdfkljhaskldjfhklajshdfkljahsdkljfh",
      image: "http://mycdn.com/image1",
      repo: "http://github.com/myuser/myrepo/",
      creator: creator.publicKey,
    };
    const _tx = await program.methods
      .createGrant(grantInfo)
      .accounts({
        grant: newGrantPDA,
        creator: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    let grant = await program.account.grant.fetch(newGrantPDA);

    expect(grant.title).to.eql(grantInfo.title);
    return newGrantPDA;
  }
  before(async () => {
    const [newProgramInfoPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("program_info")],
        program.programId
      );
    programInfoPDA = newProgramInfoPDA;
  });

  beforeEach(async () => {
    creator = await generateFundedKeypair();

    grantPDA = await generateGrant(creator);
  });

  it("Initializes Grant Program Info!", async () => {
    // Add your test here.
    const _tx = await program.methods
      .initializeProgramInfo()
      .accounts({
        authority: programWallet.publicKey,
        programInfo: programInfoPDA,
      })
      .rpc();

    const programInfo = await program.account.programInfo.fetch(programInfoPDA);

    expect(programInfo.authority).to.eql(programWallet.publicKey);
    expect(programInfo.grantsCount).to.eql(0);
  });

  it("Creates a grant!", async () => {
    creator = await generateFundedKeypair();
    await generateGrant(creator);
  });

  it("Creates a donation", async () => {
    const donor = await generateFundedKeypair();
    await generateDonation(grantPDA, donor, 0.7 * LAMPORTS_PER_SOL);
  });

  it("Releases the grant funds to the creator", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const _donationPDA = await generateDonation(grantPDA, donor, lamports);

    const initialGrantBalance = await provider.connection.getBalance(grantPDA);
    const initialCreatorBalance = await provider.connection.getBalance(
      creator.publicKey
    );

    // Act
    const _tx = await program.methods
      .releaseGrant()
      .accounts({
        authority: programWallet.publicKey,
        creator: creator.publicKey,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .rpc();

    // Assert
    const grantBalance = await provider.connection.getBalance(grantPDA);
    const creatorBalance = await provider.connection.getBalance(
      creator.publicKey
    );
    const grant = await program.account.grant.fetch(grantPDA);

    expect(grant.amountRaised.toNumber()).to.eql(lamports);
    expect(grant.state).to.eql({ released: {} });
    expect(grantBalance).to.eql(initialGrantBalance - lamports);
    expect(creatorBalance).to.eql(initialCreatorBalance + lamports);
  });

  it("Fails when trying to release same grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const _donationPDA = await generateDonation(grantPDA, donor, lamports);

    const _tx = await program.methods
      .releaseGrant()
      .accounts({
        authority: programWallet.publicKey,
        creator: creator.publicKey,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .rpc();

    const grant = await program.account.grant.fetch(grantPDA);
    expect(grant.state).to.eql({ released: {} });

    // Act
    try {
      const _tx = await program.methods
        .releaseGrant()
        .accounts({
          authority: programWallet.publicKey,
          creator: creator.publicKey,
          grant: grantPDA,
          programInfo: programInfoPDA,
        })
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

  it("Cannot create another donation account with same user and grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const donationPDA = await generateDonation(
      grantPDA,
      donor,
      2.4 * LAMPORTS_PER_SOL
    );

    const [donationLinkPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("link"), grantPDA.toBuffer(), Buffer.from([1])],
        program.programId
      );

    try {
      // Act
      const _tx = await program.methods
        .createDonation(0.7 * LAMPORTS_PER_SOL)
        .accounts({
          payer: donor.publicKey,
          donation: donationPDA,
          donationLink: donationLinkPDA,
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
    const _escrow1 = await generateDonation(
      grantPDA,
      donor1,
      2.1 * LAMPORTS_PER_SOL
    );

    const donor2 = await generateFundedKeypair();
    const _escrow2 = await generateDonation(
      grantPDA,
      donor2,
      2.1 * LAMPORTS_PER_SOL
    );
  });

  it("Cancels a donation", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 2.1 * LAMPORTS_PER_SOL;
    const donationPDA = await generateDonation(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    const initialGrantBalance = await provider.connection.getBalance(grantPDA);
    const initialDonorBalance = await provider.connection.getBalance(payer);

    // Act
    const _tx = await program.methods
      .cancelDonation()
      .accounts({
        authority: programWallet.publicKey,
        programInfo: programInfoPDA,
        donation: donationPDA,
        payer,
        grant: grantPDA,
      })
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
    const donationPDA = await generateDonation(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    const _tx = await program.methods
      .cancelDonation()
      .accounts({
        authority: programWallet.publicKey,
        programInfo: programInfoPDA,
        donation: donationPDA,
        payer,
        grant: grantPDA,
      })
      .rpc();

    const donation = await program.account.donation.fetch(donationPDA);
    expect(donation.state).to.eql({ cancelled: {} });

    try {
      // Act
      const _tx = await program.methods
        .cancelDonation()
        .accounts({
          authority: programWallet.publicKey,
          programInfo: programInfoPDA,
          donation: donationPDA,
          payer,
          grant: grantPDA,
        })
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

    const donationPDA = await generateDonation(
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

    const donationPDA = await generateDonation(
      grantPDA,
      donor,
      1 * LAMPORTS_PER_SOL
    );

    const [donationLinkPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [encode("donation_link"), grantPDA.toBuffer(), toBytesInt32(totalDonors)],
      program.programId
    );

    // Act
    const donationLink = await program.account.link.fetch(donationLinkPDA);
    
    // Assert
    expect(donationLink.address).to.eql(donationPDA);
    const donation = await program.account.donation.fetch(donationLink.address);
    expect(donation.payer).to.eql(donor.publicKey);
  });
});
