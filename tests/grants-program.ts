import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { expect } from "chai";
import { describe } from "mocha";
import { GrantsProgram } from "../target/types/grants_program";
import donations from "./suites/donations.test";
import grants from "./suites/grants.test";

describe("grants-program", function () {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;
  const programWallet = (program.provider as anchor.AnchorProvider).wallet;

  before(async function () {
    this.program = program;
    this.programWallet = programWallet;
    this.admin = await generateFundedKeypair();
    this.generateFundedKeypair = generateFundedKeypair;
    this.programInfoPDA = await initializeProgramInfo(this.admin);
  });
  
  it("Initializes Grant Program Info!", async function () {
    // Only assert it because we need it to initialize during `before` hook
    // to be able to use `.only` on other specific tests.
    const programInfo = await program.account.programInfo.fetch(this.programInfoPDA);
    expect(programInfo.admin).to.eql(this.admin.publicKey);
    expect(programInfo.grantsCount).to.eql(0);
  });

  describe("Grants", grants.bind(this)); // execute the grants suite
  describe("Donations", donations.bind(this)); // execute the donations suite


  // *** Rest of helper functions ***

  async function initializeProgramInfo(admin: Keypair) {
    const [newProgramInfoPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("program_info")],
        program.programId
      );

    const programInfo = await program.account.programInfo.fetchNullable(
      newProgramInfoPDA
    );
    if (programInfo === null) {
      const _tx = await program.methods
        .initializeProgramInfo()
        .accounts({
          admin: admin.publicKey,
          programInfo: newProgramInfoPDA,
        })
        .signers([admin])
        .rpc();
    }
    return newProgramInfoPDA;
  }
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
});
