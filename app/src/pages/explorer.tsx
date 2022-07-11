import type { NextPage } from "next";
import Head from "next/head";
import { ExplorerView } from "views/explorer";

const Explorer: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Grants Explorer</title>
        <meta name='description' content='Grants Explorer' />
      </Head>
      <ExplorerView />
    </div>
  );
};

export default Explorer;
