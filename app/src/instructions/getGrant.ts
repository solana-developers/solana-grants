import { Program, Provider, web3 } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import getGrantPDA from "./pda/getGrantPDA";

export default async function getGrant(provider: Provider, grantNumber: number) {
    try {
      const program = getProgram(provider)

      const grantPDA = await getGrantPDA(program, grantNumber);

      const grant = await program.account.grant.fetch(grantPDA);

      const balance = await provider.connection.getBalance(grantPDA);

      return { err: false, data: grant, grantPDA, lamportsRaised: balance }
    } catch (error) {
      console.log(error);
      return { err: true, message: error.message }
    }
}