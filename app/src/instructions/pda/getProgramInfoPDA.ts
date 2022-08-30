import * as anchor from "@project-serum/anchor";
import {encode} from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {Program} from "@project-serum/anchor";
import { GrantsProgram } from "idl/grants_program";

export async function getProgramInfoPDA(program: Program<GrantsProgram>) {
    const [programInfoPDA, program_info_bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
            encode("program_info"),
        ],
        program.programId
    );

    return programInfoPDA;
}