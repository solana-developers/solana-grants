import { IdlTypes, Provider } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import getGrantPDA from "./pda/getGrantPDA";
import { notify } from "../utils/notifications";
import { GrantsProgram } from 'idl/grants_program';
import { TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";

export default async function getGrants(provider: Provider, startIndex: number, endIndex: number) {
    try {
      if (!provider) {
        notify({ type: "error", message: "error", description: "Wallet not connected!" });
        return { err: true };
      }

      const program = getProgram(provider);

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