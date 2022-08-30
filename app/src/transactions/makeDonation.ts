import * as anchor from "@project-serum/anchor";
import { BN, Program } from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import { PublicKey } from "@solana/web3.js";
import { toBytesInt32 } from "../utils/conversion";
import { GrantsProgram } from "../idl/grants_program";

export async function makeDonation(
  program: Program<GrantsProgram>,
  donor: PublicKey,
  grantPDA: PublicKey,
  lamports: BN
): Promise<string>{
  
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
  
  console.log("programInfo: " + programInfoPDA.toString());

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
      .rpc();
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
      .rpc();
  }
}
