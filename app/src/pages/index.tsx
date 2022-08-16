import React, { useState } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { LandingPageView } from "../views";

const LandingPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Grants</title>
        <meta
          name="description"
          content="Solana Grants"
        />
      </Head>
      <LandingPageView />
    </div>
  );
};

export default LandingPage;
