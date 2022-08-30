import { Provider } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import getGrantPDA from "./pda/getGrantPDA";

export default async function getGrants(provider: Provider, startIndex: number, endIndex: number) {
    try {
      const program = getProgram(provider)

      const grantPDAs = [];
      const grantBalances = [];
      for (let i = startIndex; i <= endIndex; i++) {
        const pda = await getGrantPDA(program, i)
        grantPDAs.push(pda);
        grantBalances.push(await provider.connection.getBalance(pda));
      }

      let grants = await program.account.grant.fetchMultiple(grantPDAs);
      grants.forEach((grant, i) => grant["lamportsRaised"] = grantBalances[i]);

      return { err: false, data: grants}
    } catch (error) {
      console.log(error);
      return { err: true }
    }
}