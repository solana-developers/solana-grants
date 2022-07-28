import * as anchor from "@project-serum/anchor";
import {encode} from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {Program} from "@project-serum/anchor";
import {ProgramInfoModel} from "../../models/programInfo";

/**
 * converts number to bytes int32
 * @param num
 */
const toBytesInt32 = (num: number): Buffer => {
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, num);
    return Buffer.from(arr);
};

/**
 * gets grant PDA using program and programInfo
 * @param program
 * @param programInfo
 */
export default async function getGrantPDA(program: Program, grantNumber: number) {
    const [grantPDA, grant_bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
            encode("grant"),
            toBytesInt32(grantNumber),
        ],
        program.programId
    );

    return grantPDA;
}

