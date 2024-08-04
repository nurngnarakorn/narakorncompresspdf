import { useState } from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.logopdf24}>Compress PDF</span>
        <span className={styles.logotools}>Master</span>
      </div>

      {/* <div>
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/help">Help</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Use</a>
          <a href="/privacy_policy">Privacy Policy</a>
        </nav>
      </div> */}
    </header>
  );
};

export default Header;
