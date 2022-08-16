import type { NextPage } from "next";
import Head from "next/head";
import { GrantCreationFlowView } from "views";

const GrantCreationFlow: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Grants Explorer</title>
                <meta name='description' content='Grants Explorer' />
            </Head>
            <GrantCreationFlowView />
        </div>
    );
};

export default GrantCreationFlow;