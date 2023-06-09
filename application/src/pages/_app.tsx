import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { TransactionProvider } from "@/providers/TransactionProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TransactionProvider>
  );
}

export default App;
