import * as anchor from "@project-serum/anchor";
import { BN, Program } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { expect } from "chai";
import { describe } from "mocha";
import { toBytesInt32 } from "../app/src/utils/conversion";
import { GrantsProgram } from "../app/src/idl/grants_program";
import donations from "./suites/donations.test";
import grants from "./suites/grants.test";
import matches from "./suites/matches.test";

describe("grants-program", function () {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;
  const programWallet = (program.provider as anchor.AnchorProvider).wallet;
  let programInfoPDA: PublicKey;

  before(async function () {
    this.provider = provider;
    this.program = program;
    this.programWallet = programWallet;
    this.admin = await generateFundedKeypair();
    this.generateFundedKeypair = generateFundedKeypair;
    this.createGrant = createGrant; 
    this.createGrantWithDueDate = createGrantWithDueDate; 
    programInfoPDA = await initializeProgramInfo(this.admin);
    this.programInfoPDA = programInfoPDA;
  });
  
  it("Initializes Grant Program Info!", async function () {
    // Only assert it because we need it to initialize during `before` hook
    // to be able to use `.only` on other specific tests.    const programInfo = await program.account.programInfo.fetch(this.programInfoPDA);
    expect(programInfo.grantsCount).to.eql(0);
    expect(programInfo.admin.toString()).to.eql(this.admin.publicKey.toString());
  });

  describe("Grants", grants.bind(this)); // execute the grants suite
  describe("Matches", matches.bind(this)); // execute the matches suite
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

    console.log("programInfo address: " + programInfoPDA.toString());

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
  async function createGrantWithDueDate(author: Keypair, dueDate: number) {
    const targetLamports = new BN(LAMPORTS_PER_SOL);
    const info = "";

    const programInfo = await program.account.programInfo.fetch(programInfoPDA);

    const [newGrantPDA, _grantBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("grant"), toBytesInt32(programInfo.grantsCount)],
        program.programId
      );

    const [matchingDonationPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("matching_donation"), newGrantPDA.toBuffer()],
        program.programId
      );

    try {
      await program.methods
        .createGrant(info, targetLamports, new BN(dueDate))
        .accounts({
          grant: newGrantPDA,
          programInfo: programInfoPDA,
          author: author.publicKey,
          matchingDonation: matchingDonationPDA,
        })
        .signers([author])
        .rpc();
    } catch (err) {
      console.log(err);
      expect.fail();
    }

    return newGrantPDA;
  }
  async function createGrant(author: Keypair) {
    // Unix timestamp in solana is in seconds, getTime() gives it in milliseconds
    const dueDate = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 7;
    return createGrantWithDueDate(author, dueDate);
  }
});

export const matchedDonation = (lamports: number) => {
  // 1:1
  return lamports;
}
