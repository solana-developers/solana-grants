import { AppProps } from "next/app";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <div className="relative mb-20">
            <div className="absolute left-0 top-0 background-graphic-upper"></div>
            <div className="absolute left-0 right-0">
              <AppBar />
            </div>
          </div>
          <Component {...pageProps} />
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
