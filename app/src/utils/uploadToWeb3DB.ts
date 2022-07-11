import { WebBundlr } from "@bundlr-network/client";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { DEVNET_API, BUNDLR_DEVNET } from "../constants";

export default async function uploadToWeb3DB(data: Object) {
  const walletAdapter = new PhantomWalletAdapter();
  await walletAdapter.connect();

  const bundlr = new WebBundlr(BUNDLR_DEVNET, "solana", walletAdapter, { providerUrl: DEVNET_API });
  
  const dataToBeUploaded = JSON.stringify(data);

  const price = await bundlr.getPrice(dataToBeUploaded.length);

  const balance = await bundlr.getLoadedBalance();
  
  // If you don't have enough balance for the upload
  if (price.isGreaterThan(balance)) {
    // Fund your account with the difference
    // We multiply by 1.1 to make sure we don't run out of funds
    await bundlr.fund(price.minus(balance).multipliedBy(1.1).c[0]);
  }
  
  const tags = [{ name: "Content-Type", value: "text/plain" }];
  // const transaction = bundlr.createTransaction(dataToBeUploaded, { tags: tags });
  // await transaction.sign();
  // const id = (await transaction.upload()).data.id;

  const response = await bundlr.uploader.upload(Buffer.from(dataToBeUploaded), tags);

  return response.data.id;
}