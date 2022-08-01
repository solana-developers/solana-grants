import { Provider, BN } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import { getProgramInfoPDA } from "./pda/getProgramInfoPDA";
import getGrantPDA from "./pda/getGrantPDA";
import { GrantModel } from "../models/grant";
import { notify } from "../utils/notifications";

export default async function createGrant(provider: Provider, grant: GrantModel): Promise<any> {
    try {
        if (!provider) {
            notify({ type: "error", message: "error", description: "Wallet not connected!" });
            return { err: true };
        }

        const program = getProgram(provider)

        const programInfoPDA = await getProgramInfoPDA(program)

        const programInfo = await program.account.grantsProgramInfo.fetch(programInfoPDA)

        const grantPDA = await getGrantPDA(program, programInfo.grantsCount);

        await program.methods
            .createGrant(grant.info, new BN(grant.targetLamports), new BN(grant.dueDate))
            .accounts({
                grant: grantPDA,
                programInfo: programInfoPDA,
                author: provider.publicKey,
            })
            .rpc();

        console.log(await program.account.grant.fetch(grantPDA));

        return { err: false }
    } catch (error) {
        console.log(error);
        return { err: true }
    }
    
}