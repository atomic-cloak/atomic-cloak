import type { AppProps } from "next/app";
import type { NextPageWithLayout } from "@/types";
// import { Fira_Code } from 'next/font/google';
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import ModalsContainer from "@/components/modal-views/container";
import DrawersContainer from "@/components/drawer-views/container";
import SettingsButton from "@/components/settings/settings-button";
import SettingsDrawer from "@/components/settings/settings-drawer";
import { WalletProvider } from "@/lib/hooks/use-connect";
import "overlayscrollbars/overlayscrollbars.css";
// base css file
import "swiper/css";
import "swiper/css/pagination";
import "@/assets/css/scrollbar.css";
import "@/assets/css/globals.css";
import "@/assets/css/range-slider.css";
import { useState } from "react";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// const firaCode = Fira_Code({
//   weight: ['400', '500', '700'],
//   style: ['normal'],
//   subsets: ['latin'],
//   variable: '--font-body',
// });

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  //could remove this if you don't need to page level layout
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <title>Atomic Cloak - Privacy-preserving atomic swaps</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          <WalletProvider>
            {/* <div className={`${firaCode.variable} font-body`}> */}
            {getLayout(<Component {...pageProps} />)}
            <ModalsContainer />
            <DrawersContainer />
            {/* </div> */}
          </WalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
