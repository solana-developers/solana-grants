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

describe("grants-program", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;
  const programWallet = (program.provider as anchor.AnchorProvider).wallet;
  const grantKeypair = anchor.web3.Keypair.generate();
  const [escrowPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("escrow"),
      grantKeypair.publicKey.toBuffer(),
      (program.provider as anchor.AnchorProvider).wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  async function generateFundedKeypair(): Promise<anchor.web3.Keypair> {
    const newKeypair = anchor.web3.Keypair.generate();

    const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: programWallet.publicKey,
      toPubkey: newKeypair.publicKey,
      lamports: 5 * LAMPORTS_PER_SOL,
    }));
    const _confirmation = await (program.provider as anchor.AnchorProvider).sendAndConfirm(transaction);
    
    return newKeypair;
  }

  async function generateEscrow(grant: PublicKey, donor: Keypair, lamports: number): Promise<PublicKey> {

    const [escrowPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("escrow"),
        grant.toBuffer(),
        donor.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .createEscrow(lamports)
      .accounts({
        donor: donor.publicKey,
        escrow: escrowPDA,
        grant,
      })
      .signers([donor])
      .rpc();
    
    let escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.payer).to.eql(donor.publicKey);
    expect(escrow.receiver).to.eql(grant);
    expect(escrow.amount.toNumber()).to.eq(lamports);
    expect(escrow.state).to.eql({ funded: {} });

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
    console.log("Your transaction signature", tx);

    let grant = await program.account.grant.fetch(grantKeypair.publicKey);

    expect(grant.title).to.eql("first grant");
    console.log(grant.description);
  });

  it("Creates an escrow account", async () => {
    const donor = await generateFundedKeypair();
    await generateEscrow(grantKeypair.publicKey, donor, 0.7 * LAMPORTS_PER_SOL);
  });

  it("Releases an escrow to the grant", async () => {
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(grantKeypair.publicKey, donor, 0.7 * LAMPORTS_PER_SOL);
    
    const grant = (await program.account.escrow.fetch(escrowPDA)).receiver;
    const tx = await program.methods
      .releaseEscrow()
      .accounts({
        escrow: escrowPDA,
        grant,
      })
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ released: {} });
  });

  it("Fails when trying to release same escrow", async () => {
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
        grant,
      })
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ released: {} });

    try {
      const tx = await program.methods
        .releaseEscrow()
        .accounts({
          escrow: escrowPDA,
          grant,
        })
        .rpc();

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
    const donor = (program.provider as anchor.AnchorProvider).wallet;

    const lamports = 0.7 * LAMPORTS_PER_SOL;
    try {
      const tx = await program.methods
        .createEscrow(lamports)
        .accounts({
          donor: donor.publicKey,
          escrow: escrowPDA,
          grant: grantKeypair.publicKey,
        })
        .rpc();
    } catch (_err) {
      expect(_err).to.be.instanceOf(SendTransactionError);
    }
  });

  it("Creates another escrow with other user", async () => {

    const donor1 = await generateFundedKeypair();
    const _escrow1 = await generateEscrow(grantKeypair.publicKey, donor1, 2.1 * LAMPORTS_PER_SOL);

    const donor2 = await generateFundedKeypair();
    const _escrow2 = await generateEscrow(grantKeypair.publicKey, donor2, 2.1 * LAMPORTS_PER_SOL);
  });

  it("Cancels escrow", async () => {
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      2.1 * LAMPORTS_PER_SOL
    );

    const payer = (await program.account.escrow.fetch(escrowPDA)).payer;
    const tx = await program.methods
      .cancelEscrow()
      .accounts({
        escrow: escrowPDA,
        donor: payer,
      })
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ cancelled: {} });
  });

  it('Fails when trying to cancel an already cancelled escrow', async () => {
    const donor = await generateFundedKeypair();
    const escrowPDA = await generateEscrow(
      grantKeypair.publicKey,
      donor,
      2.1 * LAMPORTS_PER_SOL
    );

    const payer = (await program.account.escrow.fetch(escrowPDA)).payer;
    const tx = await program.methods
      .cancelEscrow()
      .accounts({
        escrow: escrowPDA,
        donor: payer,
      })
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ cancelled: {} });

    try {
      const tx = await program.methods
        .cancelEscrow()
        .accounts({
          escrow: escrowPDA,
          donor: payer,
        })
        .rpc();
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal("CancelledEscrow");
      expect(err.error.errorCode.number).to.equal(6000);
      expect(err.program.equals(program.programId)).is.true;
    }
  });
});
