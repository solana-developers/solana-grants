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
    const donor = (program.provider as anchor.AnchorProvider).wallet;

    const lamports = 0.7 * LAMPORTS_PER_SOL;
    const tx = await program.methods
      .createEscrow(lamports)
      .accounts({
        donor: donor.publicKey,
        escrow: escrowPDA,
        grant: grantKeypair.publicKey,
      })
      .rpc();

    let escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.payer).to.eql(donor.publicKey);
    expect(escrow.receiver).to.eql(grantKeypair.publicKey);
    expect(escrow.amount.toNumber()).to.eq(lamports);
    expect(escrow.state).to.eql({ funded: {} });
  });

  it("Releases an escrow to the grant", async () => {
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
    const grant = (await program.account.escrow.fetch(escrowPDA)).receiver;

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

    const escrow = await program.account.escrow.fetch(escrowPDA);

    expect(escrow.state).to.eql({ released: {} });
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

  // it("Creates another escrow with other user", async () => {
  //   const donor = anchor.web3.Keypair.generate();

  //   const transaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: programWallet.publicKey,
  //     toPubkey: donor.publicKey,
  //     lamports: 5 * LAMPORTS_PER_SOL,
  //   }));
    
  //   const signers = [programWallet];
  //   const confirmation = await sendAndConfirmTransaction(
  //     connection, 
  //     transaction,
  //     signers
  //   )


  //   const [escrowPDA2, _] = await anchor.web3.PublicKey.findProgramAddress(
  //     [
  //       anchor.utils.bytes.utf8.encode("escrow"),
  //       grantKeypair.publicKey.toBuffer(),
  //       donor.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );
  //   const lamports = 0.2 * LAMPORTS_PER_SOL;
  //   try {
  //     const tx = await program.methods
  //       .createEscrow(lamports)
  //       .accounts({
  //         donor: donor.publicKey,
  //         escrow: escrowPDA2,
  //         grant: grantKeypair.publicKey,
  //       })
  //       .signers([donor])
  //       .rpc();
  //   } catch (err) {
  //     console.log(err);
  //     expect.fail();
  //   }
  //   let escrow = await program.account.escrow.fetch(escrowPDA2);

  //   expect(escrow.payer).to.eql(donor.publicKey);
  //   expect(escrow.receiver).to.eql(grantKeypair.publicKey);
  //   expect(escrow.amount.toNumber()).to.eq(lamports);
  //   expect(escrow.state).to.eql({ funded: {} });
  // });
});
