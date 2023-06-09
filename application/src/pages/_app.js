import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { createPublicClient, http } from "viem";
import { WagmiConfig, createConfig, mainnet } from "wagmi";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  );
}

export default App;
