import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import {
  goerli,
  sepolia,
  gnosisChiado,
  polygonMumbai,
  optimismGoerli,
  zkSyncTestnet,
} from "wagmi/chains";
import {
  darkTheme,
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { TransactionProvider } from "@/providers/TransactionProvider";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, goerli, optimismGoerli, polygonMumbai, gnosisChiado, zkSyncTestnet],
  [publicProvider()]
);

const projectId = "YOUR_PROJECT_ID";

const { wallets } = getDefaultWallets({
  appName: "Atomic Cloak",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Atomic Cloak",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          theme={darkTheme()}
          appInfo={demoAppInfo}
          chains={chains}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </TransactionProvider>
  );
}

export default App;
