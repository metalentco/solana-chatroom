import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Header, { PAGE_TYPES } from "@/components/Header";
import ChatSpace from "@/components/ChatSpace";
import { useState } from "react";

const ChatMessaging: NextPage = () => {
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
          pageType={PAGE_TYPES.CHATMESSAGING}
        />
        <ChatSpace
          isRegisteringCollection={isRegisteringCollection}
          setIsRegisteringCollection={setIsRegisteringCollection}
        />
      </main>
    </div>
  );
};

export default ChatMessaging;
