import { WalletContextState } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import GetProvider from "./getProvider";

const sendSol = async (wallet: WalletContextState, destPubKeyString: string, solCoinsToBeTransferred: number) => {
    try{
        const destPubkey = new PublicKey(destPubKeyString);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: destPubkey,
                lamports: solCoinsToBeTransferred * LAMPORTS_PER_SOL,
            })
        );
    
        const provider = await GetProvider(wallet);
        const signature = await wallet.sendTransaction(transaction, provider.connection);
        console.log("signature: " + signature);
        return {err: false};
    }
    catch(err){
        console.log(err);
        return {err: true};
    }

}

export default sendSol;