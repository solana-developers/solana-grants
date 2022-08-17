import * as anchor from "@project-serum/anchor";
import { AnchorError, BN, Program, Provider } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SendTransactionError,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { expect, assert } from "chai";
import { makeDonation } from "../../app/src/transactions";
import { GrantsProgram } from "../../target/types/grants_program";

export default function () {
  // to be initialized in the `before` method from the context
  let provider: Provider;
  let program: Program<GrantsProgram>;
  let programInfoPDA: PublicKey;
  let admin: Keypair;
  let generateFundedKeypair: () => Promise<Keypair>;
  let createGrant: (author: Keypair) => Promise<PublicKey>;

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
  });

  beforeEach(async () => {
    author = await generateFundedKeypair();
    grantPDA = await createGrant(author);
  });

  it("creates a new matching account on grant creation", async () => {
    // Assumes a grant was created with the `beforeEach` hook

    const [matchingDonationPDA, _bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("matching_donation"), grantPDA.toBuffer()],
        program.programId
      );

    const matchingDonation = await program.account.donation.fetch(
      matchingDonationPDA
    );

    expect(matchingDonation.amount.eq(new BN(0))).to.be.true;
    expect(matchingDonation.grant).to.eql(grantPDA);
    expect(matchingDonation.payer).to.eql(programInfoPDA);
  });

  describe("without matching funds", function () {
    before(async () => {
      // TODO: drain the matcher account to not depend on the suite execution order
      //       right now it is failing to verify the signature for the PDA
      // const balance = await provider.connection.getBalance(programInfoPDA); 
      // const transaction = new Transaction().add(
      //   SystemProgram.transfer({
      //     fromPubkey: programInfoPDA,
      //     toPubkey: anchor.web3.Keypair.generate().publicKey,
      //     lamports: balance,
      //   })
      // );
      // await (program.provider as anchor.AnchorProvider).sendAndConfirm(transaction);
    });

    beforeEach(async function () {
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

    it("fails to match donations on donation creation", async () => {
      // Arrange
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);

      // Act
      let transaction = await makeDonation(program, donor.publicKey, grantPDA, lamports);
      try {
        await provider.sendAndConfirm(transaction, [donor]);
        // Assert
        expect.fail("should have failed to match");
      } catch (e) {
        expect(e).to.be.instanceOf(SendTransactionError);
        const err = AnchorError.parse(e.logs);
        expect(err.error.errorCode.code).to.equal("InsufficientFunds");
        expect(err.program).to.eql(program.programId);
      }
    });
  });
  describe("with matching eligibility and matcher funds", function () {
    before(async () => {
      // put some money on the matching account
      await provider.connection.requestAirdrop(
        programInfoPDA,
        100 * LAMPORTS_PER_SOL
      );
    });

    beforeEach(async function () {
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

    it("matches each donation on a 1:1 basis", async () => {
      // Arrange
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);

      // Act
      let transaction = await makeDonation(program, donor.publicKey, grantPDA, lamports);
      const tx = await provider.sendAndConfirm(transaction, [donor]);

      // Assert
      const [matchingDonationPDA, _] =
        await anchor.web3.PublicKey.findProgramAddress(
          [encode("matching_donation"), grantPDA.toBuffer()],
          program.programId
        );

      const matchingDonation = await program.account.donation.fetch(
        matchingDonationPDA
      );
      const grantBalance = await provider.connection.getBalance(grantPDA);

      expect(matchingDonation.amount.toNumber()).to.eq(lamports.toNumber());
      expect(grantBalance).to.be.above(2 * lamports.toNumber());
    });

    it("updates the matching amount when incrementing a donation", async () => {
      // Arrange
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);

      let transaction1 = await makeDonation(
        program, 
        donor.publicKey,
        grantPDA,
        lamports
      );
      await provider.sendAndConfirm(transaction1, [donor]);

      // Act
      let transaction2 = await makeDonation(program, 
        donor.publicKey,
        grantPDA,
        lamports
      );
      await provider.sendAndConfirm(transaction2, [donor]);

      // Assert
      const [matchingDonationPDA, _] =
        await anchor.web3.PublicKey.findProgramAddress(
          [encode("matching_donation"), grantPDA.toBuffer()],
          program.programId
        );

      const matchingDonation = await program.account.donation.fetch(
        matchingDonationPDA
      );
      const grantBalance = await provider.connection.getBalance(grantPDA);

      expect(matchingDonation.amount.toNumber()).to.eq(2 * lamports.toNumber());
      expect(grantBalance).to.be.above(4 * lamports.toNumber());
    });
  });

  describe("without matching eligibility", function () {
    it("fails to match donations on donation creation", async () => {
      // Arrange
      const donor = await generateFundedKeypair();
      const lamports = new BN(2.1 * LAMPORTS_PER_SOL);
      const initialGrantBalance = await provider.connection.getBalance(
        grantPDA
      );

      // Act
      let transaction = await makeDonation(program, donor.publicKey, grantPDA, lamports);
      try {
        await provider.sendAndConfirm(transaction, [donor]);
        // Assert
        expect.fail("should have failed to match");
      } catch (e) {
        expect(e).to.be.instanceOf(SendTransactionError);
        const err = AnchorError.parse(e.logs);
        expect(err.error.errorCode.code).to.equal("NotMatchingEligible");
        expect(err.program.equals(program.programId)).is.true;
      }
    });
  });
}
