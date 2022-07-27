import {Provider} from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import {getProgramInfoPDA} from "./pda/getProgramInfoPDA";
import getGrantPDA from "./pda/getGrantPDA";
import {GrantModel} from "../models/grant";
import {notify} from "../utils/notifications";

/**
 * Creates a grant and returns the grant
 * @param provider
 * @param grant
 */
export default async function createGrant(provider: Provider, grant: GrantModel): Promise<any> {
    const program = getProgram(provider)

    const programInfoPDA = await getProgramInfoPDA(program)

    const programInfo = await program.account.grantsProgramInfo.fetch(programInfoPDA)

    const grantPDA = await getGrantPDA(program, programInfo)

    if (provider) {
        await program.methods
            .createGrant(grant.info, 2, 22)
            .accounts({
                grant: grantPDA,
                programInfo: programInfoPDA,
                author: provider.publicKey,
            })
            .rpc();

        return program.account.grant.fetch(grantPDA);
    } else {
        console.log('error', 'Wallet not connected!');
        notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
        return;
    }
}