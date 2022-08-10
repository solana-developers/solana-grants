import { AppProps } from "next/app";
import { FC } from "react";
import { SessionProvider } from 'next-auth/react'
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";
import Toast from "components/Toast";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ContextProvider>
          <div className='flex flex-col h-screen'>
            <Notifications />
            <div className='relative mb-20'>
              <div className='absolute left-0 top-0 background-graphic-upper'></div>
              <div className='absolute left-0 right-0 z-20'>
                <AppBar />
              </div>
            </div>
            <div className='z-10'>
              <Component {...pageProps} />
            </div>
            <Toast />
          </div>
        </ContextProvider>
      </SessionProvider>
    </>
  );
};

export default App;
