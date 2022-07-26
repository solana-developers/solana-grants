import { WebBundlr } from "@bundlr-network/client";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { DEVNET_API, BUNDLR_DEVNET } from "../constants";
import { TransactionDetail } from '../constants/types';

export default async function uploadToWeb3DB(wallet: WalletContextState, data: Object, setTransactionsList: React.Dispatch<React.SetStateAction<TransactionDetail[]>>) {
  try {
    if (!wallet || !wallet.connected) {
      return { err: true, message: "Wallet not connected" };
    }

    await wallet.connect();
    const provider = wallet.wallet.adapter;
    await provider.connect();
  
    const bundlr = new WebBundlr(BUNDLR_DEVNET, "solana", provider, { providerUrl: DEVNET_API });
    
    const dataToBeUploaded = JSON.stringify(data);
    let transactionCount = 0;
  
    const price = await bundlr.getPrice(dataToBeUploaded.length);
    const balance = await bundlr.getLoadedBalance();
    
    // If you don't have enough balance for the upload
    if (price.isGreaterThan(balance)) {
      // Fund your account with the difference
      // We multiply by 1.1 to make sure we don't run out of funds
      await bundlr.fund(price.minus(balance).multipliedBy(1.1).c[0]);
    }

    setTransactionsList((transactionsList) => {
      const newTransactionsList = [...transactionsList];
      newTransactionsList[transactionCount].isCompleted = true;
      return newTransactionsList;
    });
    transactionCount += 1;
    
    const tags = [{ name: "Content-Type", value: "text/plain" }];
    const response = await bundlr.uploader.upload(Buffer.from(dataToBeUploaded), tags);

    setTransactionsList((transactionsList) => {
      const newTransactionsList = [...transactionsList];
      newTransactionsList[transactionCount].isCompleted = true;
      return newTransactionsList;
    });
    transactionCount += 1;
  
    return { err: false, id: response.data.id, transactionCount };  
  } catch (error) {
    return { err: true, message: "Something went wrong!" }
  }
  
}