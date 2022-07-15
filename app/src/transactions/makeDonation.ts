import * as anchor from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { toBytesInt32 } from "../utils/conversion";
import { program } from "./index";

export async function makeDonation(
  donor: PublicKey,
  grantPDA: PublicKey,
  lamports: number
): Promise<anchor.web3.Transaction> {
    
  // get the donation PDA
  const [donationPDA, _bump0] = await anchor.web3.PublicKey.findProgramAddress(
    [encode("donation"), grantPDA.toBuffer(), donor.toBuffer()],
    program.programId
  );

  // check if the account exists
  const donation = await program.account.donation.fetchNullable(donationPDA);
  if (donation === null) {
    // Create a new donation account
    
    // get the donation index PDA with the latest donor count
    const latestDonorCount = (await program.account.grant.fetch(grantPDA)).totalDonors;
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
        })
        .transaction();
  }
}
