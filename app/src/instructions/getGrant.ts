import { Program, Provider } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import getGrantPDA from "./pda/getGrantPDA";

export default async function getGrant(provider: Provider, grantNumber: number) {
    try {
      const program = getProgram(provider)

      const grantPDA = await getGrantPDA(program, grantNumber);

      const grant = await program.account.grant.fetch(grantPDA);

      return { err: false, data: grant, grantPDA }
    } catch (error) {
      console.log(error);
      return { err: true, message: error.message }
    }
}