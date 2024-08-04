import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Advertisement from "../components/Advertisement";
import styles from "../styles/PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Privacy Policy - Compress PDF Master</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Privacy Policy</h1>
        <p>
          This privacy policy will explain how our organization uses the
          personal data we collect from you when you use our website.
        </p>
      </main>
      <Advertisement />
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
