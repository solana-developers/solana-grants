import getProgram from "./api/getProgram";
import { getProgramInfoPDA } from "./pda/getProgramInfoPDA";
import { Provider } from "@project-serum/anchor";

export default async (provider: Provider) => {
  try {
    const program = getProgram(provider)

    const programInfoPDA = await getProgramInfoPDA(program)

    const programInfo = await program.account.programInfo.fetch(programInfoPDA)

    return { err: true, data: programInfo }
  } catch (error) {
    return { err: true } 
  }
}