import * as anchor from "@project-serum/anchor";
import {encode} from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {Program} from "@project-serum/anchor";
import { toBytesInt32 } from "utils/conversion";
import { GrantsProgram } from 'idl/grants_program';


/**
 * gets grant PDA using program and programInfo
 * @param program
 * @param programInfo
 */
export default async function getGrantPDA(program: Program<GrantsProgram>, grantNumber: number) {
    const [grantPDA, grant_bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
            encode("grant"),
            toBytesInt32(grantNumber),
        ],
        program.programId
    );

    return grantPDA;
}

