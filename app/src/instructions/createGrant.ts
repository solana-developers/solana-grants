import * as anchor from "@project-serum/anchor";
import { Provider, BN } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import { getProgramInfoPDA } from "./pda/getProgramInfoPDA";
import getGrantPDA from "./pda/getGrantPDA";
import { GrantModel } from "../models/grant";
import { toastError } from "components/Toast";
import { encode } from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";

export default async function createGrant(
  provider: Provider,
  grant: GrantModel
): Promise<any> {
  try {
    if (!provider) {
      toastError("Wallet not connected!");
      return { err: true };
    }

    const program = getProgram(provider);

    const programInfoPDA = await getProgramInfoPDA(program);

    const programInfo = await program.account.programInfo.fetch(programInfoPDA);

    const grantPDA = await getGrantPDA(program, programInfo.grantsCount);

    const [matchingDonationPDA, _bump1] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encode("matching_donation"), grantPDA.toBuffer()],
        program.programId
      );

    await program.methods
      .createGrant(
        grant.info,
        new BN(grant.targetLamports),
        new BN(grant.dueDate)
      )
      .accounts({
        grant: grantPDA,
        programInfo: programInfoPDA,
        author: provider.publicKey,
        matchingDonation: matchingDonationPDA,
      })
      .rpc();

    return { err: false };
  } catch (error) {
    console.log(error);
    return { err: true };
  }
}
