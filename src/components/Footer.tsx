import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <div>
      <main className={`${styles.main}`}>
        <section className={styles.footerSection}>
          <footer className={styles.footer}>
            <div className={styles.legalLinks}>
              <a href="/about">About us</a>
              <a href="/help">Help</a>
              <a href="/contact">Contact</a>
            </div>
            <div className={styles.legalLinks}>
              {/* <a href="/legal">Legal Notice</a> */}
              <a href="/terms">Terms of Use</a>
              <a href="/privacy_policy">Privacy Policy</a>
            </div>
          </footer>
        </section>
      </main>

      <div className={styles.coversection}>
        <section className={styles.legalLinks}>
          <p>&copy; 2024 Compress PDF Master</p>
        </section>
      </div>
    </div>
  );
};
export default Footer;
