import type { NextPage } from "next";
import Head from "next/head";
import { ExplorerView } from "views/explore";

const Explore: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Explore Grants</title>
        <meta name='description' content='Explore Grants' />
      </Head>
      <ExplorerView />
    </div>
  );
};

export default Explore;
