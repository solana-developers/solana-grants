import { AnchorProvider } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { DEVNET_API, processed } from "../../constants";
import {notify} from "../../utils/notifications";

/**
 *
 * @returns provider to the caller.
 */
export default function getProvider(wallet: AnchorWallet, allowWithoutWalletConnection?: boolean) {
    if (!wallet || (!allowWithoutWalletConnection && !wallet.publicKey)) {
        notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
        return;
    }

    /* Create the provider and return it to the caller */
    const connection = new Connection(DEVNET_API, processed);

    return new AnchorProvider(
      connection, wallet, { preflightCommitment: processed },
    );
}
