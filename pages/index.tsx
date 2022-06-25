import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Header, { PAGE_TYPES } from "@/components/Header";
import Link from "next/link";

const Home: NextPage = () => {

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
          pageType={PAGE_TYPES.HOME}
        />

        <div className={styles.linkWrapper}>
          <Link href="/chatmessaging">
            <button className={styles.buttonLink}>Chat Messaging</button>
          </Link>
          <Link href="/activityfeeds">
            <button className={styles.buttonLink}>Activity Feeds</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
