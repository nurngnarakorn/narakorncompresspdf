import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Advertisement from "../components/Advertisement";
import styles from "../styles/Terms.module.css";

const Terms = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Terms of Use - Compress PDF Master</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Terms of Use</h1>
        <p>
          These are the terms and conditions for using Compress PDF Master.
          Please read them carefully.
        </p>
      </main>
      <Advertisement />
      <Footer />
    </div>
  );
};

export default Terms;
