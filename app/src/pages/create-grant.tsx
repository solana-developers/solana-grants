import type { NextPage } from "next";
import Head from "next/head";
import { GrantCreationView } from "views";

const GrantCreationFlow: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Grants Explorer</title>
                <meta name='description' content='Grants Explorer' />
            </Head>
            <GrantCreationView />
        </div>
    );
};

export default GrantCreationFlow;