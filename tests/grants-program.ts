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

describe("grants-program: Escrows", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;
  const programWallet = (program.provider as anchor.AnchorProvider).wallet;

  // to be initialized in the `before` method
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

  async function generateEscrow(
    grant: PublicKey,
    donor: Keypair,
    lamports: number
  ): Promise<PublicKey> {
    const [escrowPDA, _bump0] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("escrow"),
        grant.toBuffer(),
        donor.publicKey.toBuffer(),
      ],
      program.programId
    );

    const escrowCount = (await program.account.grant.fetch(grant)).escrowCount;
    const [escrowIndexPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("escrow_index"), grant.toBuffer(), toBytesInt32(escrowCount)],
        program.programId
      );

    const _tx = await program.methods
      .createEscrow(lamports)
      .accounts({
        payer: donor.publicKey,
        escrow: escrowPDA,
        escrowIndex: escrowIndexPDA,
        grant,
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

  before(async () => {
    creator = await generateFundedKeypair();
    const [newGrantPDA, _grantBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("grant"), creator.publicKey.toBuffer()],
        program.programId
      );
    grantPDA = newGrantPDA;
  });

  it("Creates a grant!", async () => {

    const grantInfo = {
      title: "first grant",
      description:
        "skadkfjaskdjfhaklsjdhfjklashdfkljhaskldjfhklajshdfkljahsdkljfh",
      image: "http://mycdn.com/image1",
      repo: "http://github.com/myuser/myrepo/",
    };
    const _tx = await program.methods
      .createGrant(grantInfo)
      .accounts({
        grant: grantPDA,
        creator: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    let grant = await program.account.grant.fetch(grantPDA);

    expect(grant.title).to.eql(grantInfo.title);
  });

  it("Creates an escrow account", async () => {
    const donor = await generateFundedKeypair();
    await generateEscrow(grantPDA, donor, 0.7 * LAMPORTS_PER_SOL);
  });

  it("Releases an escrow to the grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const escrowPDA = await generateEscrow(grantPDA, donor, lamports);

    const grant = grantPDA;
    const initialEscrowBalance = await provider.connection.getBalance(
      escrowPDA
    );
    const initialGrantBalance = await provider.connection.getBalance(grant);

    // Act
    const _tx = await program.methods
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
      grantPDA,
      donor,
      0.7 * LAMPORTS_PER_SOL
    );
    const grant = (await program.account.escrow.fetch(escrowPDA)).receiver;

    const _tx = await program.methods
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
      const _tx = await program.methods
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

  it("Cannot create another escrow account with same user and grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(
      grantPDA,
      donor,
      2.4 * LAMPORTS_PER_SOL
    );

    const [escrowIndexPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("grant_escrow"), grantPDA.toBuffer(), Buffer.from([1])],
        program.programId
      );

    try {
      // Act
      const _tx = await program.methods
        .createEscrow(0.7 * LAMPORTS_PER_SOL)
        .accounts({
          payer: donor.publicKey,
          escrow: escrowPDA,
          escrowIndex: escrowIndexPDA,
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

  it("Creates another escrow with other user", async () => {
    const donor1 = await generateFundedKeypair();
    const _escrow1 = await generateEscrow(
      grantPDA,
      donor1,
      2.1 * LAMPORTS_PER_SOL
    );

    const donor2 = await generateFundedKeypair();
    const _escrow2 = await generateEscrow(
      grantPDA,
      donor2,
      2.1 * LAMPORTS_PER_SOL
    );
  });

  it("Cancels escrow", async () => {
    // Arrange
    const donor = await generateFundedKeypair();
    const lamports = 2.1 * LAMPORTS_PER_SOL;
    const escrowPDA = await generateEscrow(grantPDA, donor, lamports);

    const payer = donor.publicKey;

    const initialEscrowBalance = await provider.connection.getBalance(
      escrowPDA
    );
    const initialDonorBalance = await provider.connection.getBalance(payer);

    // Act
    const _tx = await program.methods
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
      grantPDA,
      donor,
      2.1 * LAMPORTS_PER_SOL
    );

    const payer = donor.publicKey;

    const _tx = await program.methods
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
      const _tx = await program.methods
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
      grantPDA,
      donor,
      1 * LAMPORTS_PER_SOL
    );

    // Act
    const _tx = await program.methods
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

  it("Escrows can be fetched when we only know the grant", async () => {
    // Arrange
    const donor = await generateFundedKeypair();

    const escrowCount = (await program.account.grant.fetch(grantPDA)).escrowCount;

    const escrowPDA = await generateEscrow(
      grantPDA,
      donor,
      1 * LAMPORTS_PER_SOL
    );

    const [escrowIndexPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [encode("escrow_index"), grantPDA.toBuffer(), toBytesInt32(escrowCount)],
      program.programId
    );

    // Act
    const escrowIndex = await program.account.escrowIndex.fetch(escrowIndexPDA);

    // Assert
    expect(escrowIndex.escrow).to.eql(escrowPDA);
  });
});
