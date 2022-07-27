import * as anchor from "@project-serum/anchor";
import {encode} from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {Program} from "@project-serum/anchor";

/**
 * gets the program info PDA by using the program
 * @param program
 */
export async function getProgramInfoPDA(program: Program) {
    const [programInfoPDA, program_info_bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
            encode("program_info"),
        ],
        program.programId
    );

    return programInfoPDA;
}