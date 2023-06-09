import Head from "next/head";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Home() {
  const { address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <>
      <Head>
        <title>Atomic Cloak</title>
        <meta name="description" content="Privacy preserving atomic swaps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {address ? (
        <div>
          Connected to {address}
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect()}>Connect Wallet</button>
      )}
    </>
  );
}
