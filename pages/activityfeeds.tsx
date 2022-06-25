import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Header, { PAGE_TYPES } from "@/components/Header";
import { useState } from "react";
import ActivitySpace from "@/components/ActivitySpace";

const ActivityFeeds: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Chat</title>
        <meta name="description" content="Open Demo App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header
          onRegisterCollection={null}
          pageType={PAGE_TYPES.ACTIVITYFEEDS}
        />
        <ActivitySpace />
      </main>
    </div>
  );
};

export default ActivityFeeds;
