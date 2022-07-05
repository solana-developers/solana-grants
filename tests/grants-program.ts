import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SendTransactionError,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { expect } from "chai";
import { GrantsProgram } from "../target/types/grants_program";

describe("grants-program: Escrows", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;
  const programWallet = (program.provider as anchor.AnchorProvider).wallet;
  const grantKeypair = anchor.web3.Keypair.generate();

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

  async function generateEscrow(
    grant: PublicKey,
    donor: Keypair,
    lamports: number
  ): Promise<PublicKey> {
    const [escrowPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("escrow"),
        grant.toBuffer(),
        donor.publicKey.toBuffer(),
      ],
      program.programId
    );

    const _tx = await program.methods
      .createEscrow(lamports)
      .accounts({
        payer: donor.publicKey,
        escrow: escrowPDA,
        receiver: grant,
      })
      .signers([donor])
      .rpc();

    let escrow = await program.account.escrow.fetch(escrowPDA);
    const escrowBalance = await provider.connection.getBalance(escrowPDA);

    expect(escrow.payer).to.eql(donor.publicKey);
    expect(escrow.receiver).to.eql(grant);
    expect(escrow.amount.toNumber()).to.eq(lamports);
    expect(escrow.state).to.eql({ funded: {} });

    expect(escrowBalance).to.be.above(lamports);

    return escrowPDA;
  }
  it("Creates a grant!", async () => {
    // Add your test here.
    const creator = (program.provider as anchor.AnchorProvider).wallet;

    const grantInfo = {
      title: "first grant",
      description:
        "skadkfjaskdjfhaklsjdhfjklashdfkljhaskldjfhklajshdfkljahsdkljfh",
      image: "http://mycdn.com/image1",
      repo: "http://github.com/myuser/myrepo/",
    };
    const tx = await program.methods
      .createGrant(grantInfo)
      .accounts({
        grant: grantKeypair.publicKey,
        creator: creator.publicKey,
      })
      .signers([grantKeypair])
      .rpc();

    let grant = await program.account.grant.fetch(grantKeypair.publicKey);

    expect(grant.title).to.eql(grantInfo.title);
  });

  it("Creates an escrow account", async () => {
    const donor = await generateFundedKeypair();
    await generateEscrow(grantKeypair.publicKey, donor, 0.7 * LAMPORTS_PER_SOL);
  });

  it("Releases an escrow to the grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      lamports
    );

    const grant = grantKeypair.publicKey;
    const initialEscrowBalance = await provider.connection.getBalance(
      escrowPDA
    );
    const initialGrantBalance = await provider.connection.getBalance(grant);

    // Act
    const tx = await program.methods
      .releaseEscrow()
      .accounts({
        escrow: escrowPDA,
        receiver: grant,
      })
      .rpc();

    // Assert
    const escrowBalance = await provider.connection.getBalance(escrowPDA);
    const grantBalance = await provider.connection.getBalance(grant);
    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrowBalance).to.eql(initialEscrowBalance - lamports);
    expect(grantBalance).to.eql(initialGrantBalance + lamports);
    expect(escrow.state).to.eql({ released: {} });
  });

  it("Fails when trying to release same escrow", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      0.7 * LAMPORTS_PER_SOL
    );
    const grant = (await program.account.escrow.fetch(escrowPDA)).receiver;

    const tx = await program.methods
      .releaseEscrow()
      .accounts({
        escrow: escrowPDA,
        receiver: grant,
      })
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ released: {} });

    // Act
    try {
      const tx = await program.methods
        .releaseEscrow()
        .accounts({
          escrow: escrowPDA,
          receiver: grant,
        })
        .rpc();

      // Assert
      expect.fail("Should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal("ReleasedEscrow");
      expect(err.error.errorCode.number).to.equal(6001);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("Same user and grant cannot create another escrow account", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      2.4 * LAMPORTS_PER_SOL
    );

    try {
      // Act
      const tx = await program.methods
        .createEscrow(0.7 * LAMPORTS_PER_SOL)
        .accounts({
          payer: donor.publicKey,
          escrow: escrowPDA,
          receiver: grantKeypair.publicKey,
        })
        .signers([donor])
        .rpc();

      // Assert
      expect.fail("This should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(SendTransactionError);
    }
  });

  it("Creates another escrow with other user", async () => {
    const donor1 = await generateFundedKeypair();
    const _escrow1 = await generateEscrow(
      grantKeypair.publicKey,
      donor1,
      2.1 * LAMPORTS_PER_SOL
    );

    const donor2 = await generateFundedKeypair();
    const _escrow2 = await generateEscrow(
      grantKeypair.publicKey,
      donor2,
      2.1 * LAMPORTS_PER_SOL
    );
  });

  it("Cancels escrow", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 2.1 * LAMPORTS_PER_SOL;
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      lamports
    );

    const payer = donor.publicKey;

    const initialEscrowBalance = await provider.connection.getBalance(
      escrowPDA
    );
    const initialDonorBalance = await provider.connection.getBalance(payer);

    // Act
    const tx = await program.methods
      .cancelEscrow()
      .accounts({
        escrow: escrowPDA,
        payer,
      })
      .rpc();

    // Assert
    const escrow = await program.account.escrow.fetch(escrowPDA);
    const escrowBalance = await provider.connection.getBalance(escrowPDA);
    const donorBalance = await provider.connection.getBalance(payer);

    expect(escrowBalance).to.be.eql(initialEscrowBalance - lamports);
    expect(donorBalance).to.be.eql(initialDonorBalance + lamports);
    expect(escrow.state).to.eql({ cancelled: {} });
  });

  it("Fails when trying to cancel an already cancelled escrow", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      2.1 * LAMPORTS_PER_SOL
    );

    const payer = donor.publicKey;

    const tx = await program.methods
      .cancelEscrow()
      .accounts({
        escrow: escrowPDA,
        payer,
      })
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ cancelled: {} });

    try {
      // Act
      const tx = await program.methods
        .cancelEscrow()
        .accounts({
          escrow: escrowPDA,
          payer,
        })
        .rpc();
      
      // Assert
      expect.fail("Should've failed but didn't");
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal("CancelledEscrow");
      expect(err.error.errorCode.number).to.equal(6000);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("Users can increment the escrow funds", async () => {
    // Arrange
    const donor = await generateFundedKeypair();

    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      1 * LAMPORTS_PER_SOL
    );

    // Act
    const tx = await program.methods
      .incrementEscrow(1 * LAMPORTS_PER_SOL)
      .accounts({
        escrow: escrowPDA,
        payer: donor.publicKey,
      })
      .signers([donor])
      .rpc();

    // Assert
    const escrow = await program.account.escrow.fetch(escrowPDA);
    const escrowBalance = await provider.connection.getBalance(escrowPDA);
    
    expect(escrow.state).to.eql({ funded: {} });
    expect(escrowBalance).to.be.above(2 * LAMPORTS_PER_SOL);
  });
});
