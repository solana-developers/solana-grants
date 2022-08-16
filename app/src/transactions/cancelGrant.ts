import * as anchor from "@project-serum/anchor";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import { PublicKey, Transaction } from "@solana/web3.js";
import { program } from "./index";
import { toBytesInt32 } from "../utils/conversion";

/**
 * Cancels a grant and refunds the money to each of its donors
 *
 * @param grantPDA The grant's address
 * @param admin This function will determine if this key belongs to the
 * admin or author and call the appropriate function
 */
export async function cancelGrant(grantPDA: PublicKey, admin: PublicKey) {
  const [programInfoPDA, _bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encode("program_info")],
      program.programId
    );

  let tx = new Transaction();

  // begin with the grant cancellation
  tx.add(
    await program.methods
      .cancelGrantAdmin()
      .accounts({
        admin: admin,
        grant: grantPDA,
        programInfo: programInfoPDA,
      })
      .instruction()
  );

  // add all donation cancellation instructions to the transaction
  tx.add(await refundDonations(grantPDA, admin, programInfoPDA));

  return tx;
}

/**
 * Refunds all donations of a grant to its donors, it needs the grant to be already cancelled
 */
export async function refundDonations(
  grantPDA: PublicKey,
  admin: PublicKey,
  programInfoPDA: PublicKey
) {
  let tx = new Transaction();

  const grant = await program.account.grant.fetch(grantPDA);

  // refund the matcher donation
  const [matchingDonationPDA] = await anchor.web3.PublicKey.findProgramAddress(
    [encode("matching_donation"), grantPDA.toBuffer()],
    program.programId
  );
  const matchingDonation = await program.account.donation.fetch(
    matchingDonationPDA
  );
  const cancelDonationIx = await program.methods
    .cancelDonation()
    .accounts({
      admin: admin,
      programInfo: programInfoPDA,
      donation: matchingDonationPDA,
      payer: matchingDonation.payer,
      grant: grantPDA,
    })
    .instruction();

  tx.add(cancelDonationIx);

  // refund the donor donations
  for (let i = 0; i < grant.totalDonors; i++) {
    const donationPDA = await findDonationPDA(grantPDA, i);
    const donation = await program.account.donation.fetch(donationPDA);
    const cancelDonationIx = await program.methods
      .cancelDonation()
      .accounts({
        admin: admin,
        programInfo: programInfoPDA,
        donation: donationPDA,
        payer: donation.payer,
        grant: grantPDA,
      })
      .instruction();
    tx.add(cancelDonationIx);
  }

  return tx;
}

async function findDonationPDA(grantPDA: PublicKey, donorIndex: number) {
  const [donationIndexPDA, _bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encode("donation_index"), grantPDA.toBuffer(), toBytesInt32(donorIndex)],
      program.programId
    );

  const donationIndex = await program.account.link.fetch(donationIndexPDA);
  return donationIndex.address;
}
