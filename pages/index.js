import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Exchange from "../components/Exchange";
import NumbersEntrance from "../components/Enter";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NUMBERS</title>
        <meta name="description" content="Random numbers game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Exchange />
      <NumbersEntrance />
    </div>
  );
}
