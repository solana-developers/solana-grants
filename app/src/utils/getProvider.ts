import { AnchorProvider } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { DEVNET_API, processed } from "../constants";

/**
 *
 * @returns provider to the caller.
 */
export default async function GetProvider(wallet: AnchorWallet | undefined) {
    if (!wallet) {
      return null;
    }

    /* Create the provider and return it to the caller */
    const connection = new Connection(DEVNET_API, processed);

    return new AnchorProvider(
      connection, wallet, { preflightCommitment: processed },
    );
}
