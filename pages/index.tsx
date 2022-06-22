import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Header from "@/components/Header";
import WorkSpace from "@/components/WorkSpace";
import { useState } from "react";

const Home: NextPage = () => {
  const [isRegisteringCollection, setIsRegisteringCollection] =
    useState<boolean>(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Op3n D3mo</title>
        <meta name="description" content="Open Demo App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header
          onRegisterCollection={() => {
            setIsRegisteringCollection(true);
          }}
        />
        <WorkSpace
          isRegisteringCollection={isRegisteringCollection}
          setIsRegisteringCollection={setIsRegisteringCollection}
        />
      </main>
    </div>
  );
};

export default Home;
