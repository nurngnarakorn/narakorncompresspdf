import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Advertisement from "../components/Advertisement";
import styles from "../styles/Help.module.css";

const Help = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Help - Compress PDF Master</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Help</h1>
        <p>
          If you need assistance with using Compress PDF Master, please refer to
          the frequently asked questions below or contact our support team.
        </p>
        <h2>FAQ</h2>
        <p>
          Here you can include frequently asked questions and their answers.
        </p>
      </main>
      <Advertisement />
      <Footer />
    </div>
  );
};

export default Help;
