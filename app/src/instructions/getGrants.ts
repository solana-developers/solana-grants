import { Provider } from "@project-serum/anchor";
import getProgram from "./api/getProgram";
import getGrantPDA from "./pda/getGrantPDA";
import { notify } from "../utils/notifications";

export default async function getGrants(provider: Provider, startIndex: number, endIndex: number) {
    try {
      if (!provider) {
        notify({ type: "error", message: "error", description: "Wallet not connected!" });
        return { err: true };
      }

      const program = getProgram(provider)

      const indices = [];
      for (let i = startIndex; i <= endIndex; i++) {
        indices.push(i);
      }

      const grantPDAs = await Promise.all(indices.map(async (idx) => {
        const grantPDA = await getGrantPDA(program, idx);
        return grantPDA;
      }));

      const grants = await program.account.grant.fetchMultiple(grantPDAs);

      return { err: false, data: grants }
    } catch (error) {
      console.log(error);
      return { err: true }
    }
}