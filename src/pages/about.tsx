import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Advertisement from "../components/Advertisement";
import styles from "../styles/About.module.css";

const About = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>About Us - Compress PDF Master</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>About Us</h1>
        <p>
          Welcome to Compress PDF Master, your number one source for all PDF
          compression needs. We're dedicated to providing you the best service,
          with a focus on dependability, customer service, and efficiency.
        </p>
        <p>
          Founded in 2024, Compress PDF Master has come a long way from its
          beginnings. When we first started out, our passion for providing the
          best PDF compression drove us to start our own business.
        </p>
        <p>
          We hope you enjoy our services as much as we enjoy offering them to
          you. If you have any questions or comments, please don't hesitate to
          contact us.
        </p>
      </main>
      <Advertisement />
      <Footer />
    </div>
  );
};

export default About;
