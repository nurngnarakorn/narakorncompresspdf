import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <div className={styles.footerColumn}>
          <h3>All tools</h3>
          <ul>
            <li>
              <a href="#">Merge PDF</a>
            </li>
            <li>
              <a href="#">Split PDF</a>
            </li>
            <li>
              <a href="#">Compress PDF</a>
            </li>
            <li>
              <a href="#">Edit PDF</a>
            </li>
            <li>
              <a href="#">Sign PDF</a>
            </li>
            <li>
              <a href="#">PDF Converter</a>
            </li>
            <li>
              <a href="#">Convert to PDF</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>&nbsp;</h3>
          <ul>
            <li>
              <a href="#">Images to PDF</a>
            </li>
            <li>
              <a href="#">PDF to Images</a>
            </li>
            <li>
              <a href="#">Extract PDF Images</a>
            </li>
            <li>
              <a href="#">Protect PDF</a>
            </li>
            <li>
              <a href="#">Unlock PDF</a>
            </li>
            <li>
              <a href="#">Rotate PDF pages</a>
            </li>
            <li>
              <a href="#">Remove PDF pages</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>&nbsp;</h3>
          <ul>
            <li>
              <a href="#">Extract PDF pages</a>
            </li>
            <li>
              <a href="#">Sort PDF pages</a>
            </li>
            <li>
              <a href="#">Webpage to PDF</a>
            </li>
            <li>
              <a href="#">Create PDF job application</a>
            </li>
            <li>
              <a href="#">Create PDF with camera</a>
            </li>
            <li>
              <a href="#">PDF OCR</a>
            </li>
            <li>
              <a href="#">Add watermark</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>&nbsp;</h3>
          <ul>
            <li>
              <a href="#">Add page numbers</a>
            </li>
            <li>
              <a href="#">View as PDF</a>
            </li>
            <li>
              <a href="#">PDF Overlay</a>
            </li>
            <li>
              <a href="#">Compare PDFs</a>
            </li>
            <li>
              <a href="#">Web optimize PDF</a>
            </li>
            <li>
              <a href="#">Annotate PDF</a>
            </li>
            <li>
              <a href="#">Redact PDF</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>&nbsp;</h3>
          <ul>
            <li>
              <a href="#">Create PDF</a>
            </li>
            <li>
              <a href="#">PDF 24 Creator</a>
            </li>
            <li>
              <a href="#">PDF Printer</a>
            </li>
            <li>
              <a href="#">PDF Reader</a>
            </li>
            <li>
              <a href="#">Create invoice</a>
            </li>
            <li>
              <a href="#">Remove PDF metadata</a>
            </li>
            <li>
              <a href="#">Flatten PDF</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>&nbsp;</h3>
          <ul>
            <li>
              <a href="#">Crop PDF</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.legalLinks}>
          <a href="#">About us</a>
          <a href="#">Help</a>
          <a href="#">Contact</a>
        </div>
        <div className={styles.legalLinks}>
          <a href="#">Legal Notice</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Privacy Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
