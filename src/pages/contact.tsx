import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Advertisement from "../components/Advertisement";
import styles from "../styles/Contact.module.css";

const Contact = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Us - Compress PDF Master</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Contact Us</h1>
        <p>
          If you have any questions, comments, or concerns, feel free to reach
          out to us using the form below or via email at
          support@compresspdfmaster.com.
        </p>
        <form className={styles.contactForm}>
          <label>Name:</label>
          <input type="text" name="name" />
          <label>Email:</label>
          <input type="email" name="email" />
          <label>Message:</label>
          <textarea name="message"></textarea>
          <button type="submit">Submit</button>
        </form>
      </main>
      <Advertisement />
      <Footer />
    </div>
  );
};

export default Contact;
