import type { NextPage } from "next";
import Head from "next/head";
import { ExplorerCard } from "../components/ExplorerCard";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <div className="columns-sm gap-8">
      <ExplorerCard />
      <ExplorerCard />
      <ExplorerCard />
      <ExplorerCard />
      </div>
      <HomeView />
    </div>
  );
};

export default Home;
