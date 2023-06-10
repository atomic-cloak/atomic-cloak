import React, { useContext } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { Main } from "@/components/Main";
import { TransactionContext } from "@/providers/TransactionProvider";

const Home: NextPage = () => {
  const { isLoading } = useContext(TransactionContext);

  return (
    <>
      <Head>
        <title>Atomic Cloak - Privacy preserving atomic swaps</title>
        <meta name="description" content="privacy preserving atomic swaps" />
      </Head>
      <Header />
      <main>
        <Main />
        {isLoading ? <Loader /> : null}
      </main>
    </>
  );
};

export default Home;
