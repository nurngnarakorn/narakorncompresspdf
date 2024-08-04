import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Advertisement from "../components/Advertisement";
import styles from "../styles/Legal.module.css";

const Legal = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Legal Notice - Compress PDF Master</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Legal Notice</h1>
        <p>
          This is where your legal notice content will go. Include any legal
          information relevant to your business here.
        </p>
      </main>
      <Advertisement />
      <Footer />
    </div>
  );
};

export default Legal;
