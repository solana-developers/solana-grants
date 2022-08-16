import { AnchorProvider } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { toastError } from "components/Toast";
import { DEVNET_API, processed } from "../../constants";

/**
 *
 * @returns provider to the caller.
 */
export default function getProvider(wallet: AnchorWallet | undefined, allowWithoutWalletConnection?: boolean) {
    if (!allowWithoutWalletConnection && (!wallet || !wallet.publicKey)) {
        toastError("Wallet not connected!")
        return;
    }

    /* Create the provider and return it to the caller */
    const connection = new Connection(DEVNET_API, processed);

    return new AnchorProvider(
      connection, wallet, { preflightCommitment: processed },
    );
}
