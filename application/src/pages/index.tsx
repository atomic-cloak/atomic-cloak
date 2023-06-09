import type { NextPage } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import { Main } from "@/components/Main";
import { TransactionHistory } from "@/components/TransactionHistory";

const Home: NextPage = () => {
  return (
    <div className="h-screen max-h-screen h-min-screen w-screen bg-[#000000] text-white select-none flex flex-col justify-between">
      <Head>
        <title>Atomic Cloak - Privacy preserving atomic swaps</title>
        <meta name="description" content="privacy preserving atomic swaps" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Header />
      <Main />
      <TransactionHistory />
    </div>
  );
};

export default Home;
