import * as anchor from "@project-serum/anchor";
import { BN, Program } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import { PublicKey } from "@solana/web3.js";
import getProgram from "instructions/api/getProgram";
import getProvider from "instructions/api/getProvider";
import { toBytesInt32 } from "../utils/conversion";
// import { program } from "./index";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { GrantsProgram } from "../idl/grants_program";

let program: Program<GrantsProgram> = undefined;

export async function makeDonation2(
  wallet: AnchorWallet,
  grantPDA: PublicKey,
  lamports: BN
) {
  const provider = getProvider(wallet);
  program = getProgram(provider) as Program<GrantsProgram>;
  return makeDonation(wallet.publicKey, grantPDA, lamports);
}

export async function makeDonation(
  donor: PublicKey,
  grantPDA: PublicKey,
  lamports: BN
): Promise<anchor.web3.Transaction> {
  // find the donation PDA
  const [donationPDA, _bump0] = await anchor.web3.PublicKey.findProgramAddress(
    [encode("donation"), grantPDA.toBuffer(), donor.toBuffer()],
    program.programId
  );

  const [matchingDonationPDA, _bump2] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encode("matching_donation"), grantPDA.toBuffer()],
      program.programId
    );

  const [programInfoPDA, _bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encode("program_info")],
      program.programId
    );

  // check if the account exists
  const donation = await program.account.donation.fetchNullable(donationPDA);

  if (donation === null) {
    // Create a new donation account

    // find the donation index PDA with the latest donor count
    const latestDonorCount = (await program.account.grant.fetch(grantPDA))
      .totalDonors;
    const [donationIndexPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          encode("donation_index"),
          grantPDA.toBuffer(),
          toBytesInt32(latestDonorCount),
        ],
        program.programId
      );

    return program.methods
      .createDonation(lamports)
      .accounts({
        payer: donor,
        grant: grantPDA,
        donation: donationPDA,
        donationIndex: donationIndexPDA,
        matchingDonation: matchingDonationPDA,
        programInfo: programInfoPDA,
      })
      .transaction();
  } else {
    // Increment the existing donation
    return program.methods
      .incrementDonation(lamports)
      .accounts({
        donation: donationPDA,
        payer: donor,
        grant: grantPDA,
        matchingDonation: matchingDonationPDA,
        programInfo: programInfoPDA,
      })
      .transaction();
  }
}
