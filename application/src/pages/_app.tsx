import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { TransactionProvider } from "@/providers/TransactionProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  );
}

export default App;
