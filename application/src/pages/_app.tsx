import type { AppProps } from "next/app";
import type { NextPageWithLayout } from "@/types";
// import { Fira_Code } from 'next/font/google';
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import ModalsContainer from "@/components/modal-views/container";
import DrawersContainer from "@/components/drawer-views/container";
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

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Head>
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
            {getLayout(<Component {...pageProps} />)}
            <ModalsContainer />
            <DrawersContainer />
          </WalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
