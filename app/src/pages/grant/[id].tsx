import getProvider from "instructions/api/getProvider";
import getGrant from "instructions/getGrant";
import getProgramInfo from "instructions/getProgramInfo";
import { Keypair } from "@solana/web3.js";
import { loremIpsum } from "lorem-ipsum";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { GrantView, Props as GrantViewProps } from "views/grant";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import fetchDataFromArweave from "../../utils/fetchDataFromArweave";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const GrantPage: NextPage<{ grantViewProps: GrantViewProps }> = (props) => {
  return (
    <div>
      <Head>
        <title>{props.grantViewProps.title}</title>
        <meta name='description' content='Grant details' />
      </Head>
      <GrantView {...props.grantViewProps} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  /* using new PhantomWalletAdapter to just fake a wallet here, since an actual connected wallet is not
     needed for this operation, we just provide it since "new AnchorProvider()" expects a parameter type of AnchorWallet
  */
  const provider = getProvider(new PhantomWalletAdapter(), true);

  const programInfoResponse = await getProgramInfo(provider);

  if (programInfoResponse.err || !programInfoResponse.data.grantsCount) {
    return { paths: [], fallback: "blocking" };
  }

  const paths = Array(programInfoResponse.data.grantsCount).map((_, i) => ({
    params: { id: i.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  /* using new PhantomWalletAdapter to just fake a wallet here, since an actual connected wallet is not
     needed for this operation, we just provide it since "new AnchorProvider()" expects a parameter type of AnchorWallet
  */
  const provider = getProvider(new PhantomWalletAdapter(), true);
  console.log(params);

  const grantInfo = await getGrant(provider, parseInt(params.id as string));
  if (grantInfo.err) {
    if (grantInfo.message?.includes("Account does not exist")) {
      return { props: { grantViewProps: { err: true, message: "Not Found" } } };
    }
    return {
      props: { grantViewProps: { err: true, message: "Something went wrong" } },
    };
  }

  const grant = grantInfo.data;
  if (!grant) {
    return {
      props: { grantViewProps: { err: true, message: "Something went wrong" } },
    };
  }

  let allowDonation = true;
  let reasonForNotAllowingDonation = "";

  const dueDate = grant.dueDate.toNumber();

  if (new Date().getTime() > grant.dueDate.toNumber()) {
    allowDonation = false;
    reasonForNotAllowingDonation = "The due date has passed";
  }
  const lamportsRaised = grant.lamportsRaised.toNumber();

  const targetLamports = grant.targetLamports.toNumber();

  if (grant.lamportsRaised >= grant.targetLamports) {
    allowDonation = false;
    reasonForNotAllowingDonation =
      "The target amount has already been achieved";
  }

  if (!grant.isMatchingEligible) {
    allowDonation = false;
    reasonForNotAllowingDonation =
      "This grant is not currently ready to accept donations. Please check again later";
  }

  if (grant.fundingState === { cancelled: {} }) {
    allowDonation = false;
    reasonForNotAllowingDonation = "This grant has been cancelled";
  }

  const walletAddress = grant.author.toString();

  const arweaveResponse = await fetchDataFromArweave(grant.info);
  // console.log(arweaveResponse);
  if (arweaveResponse.err) {
    return {
      props: { grantViewProps: { err: true, message: "Something went wrong" } },
    };
  }
  const dataFromArweave = arweaveResponse.data;
  // Object.keys(dataFromArweave).map((key) => {
  //   grant[key] = dataFromArweave[key];
  // });

  const grantViewProps: GrantViewProps = {
    grantNum: parseInt(params.id as string),
    grantPDA: grantInfo.grantPDA.toString(),
    title: dataFromArweave.title,
    author: {
      name: "", // will be populated on frontend
      ghUser: "", // will be populated on frontend
      ghAvatar: "", // will be populated on frontend
      walletAddress: walletAddress,
    },
    about: dataFromArweave.about,
    description: dataFromArweave.description,
    amountRaised: parseFloat(
      (lamportsRaised / LAMPORTS_PER_SOL).toFixed(2)
    ),
    amountGoal: parseFloat(
      (targetLamports / LAMPORTS_PER_SOL).toFixed(2)
    ),
    numContributors: grant.totalDonors,
    targetDate: dueDate,
    ghRepo: dataFromArweave.projectGithubLink,
    ghUserId: dataFromArweave.githubUserId,
    website: dataFromArweave.projectWebsite,
    image: dataFromArweave.imageLink,
    allowDonation,
    reasonForNotAllowingDonation,
  };

  // Pass grant data to the page via props
  return { props: { grantViewProps } };
};

export default GrantPage;
