import Head from "next/head";
import { useState } from "react";
import { Upload, message } from "antd";
import type { UploadProps } from "antd";
const InboxOutlined =
  require("@ant-design/icons/lib/icons/InboxOutlined").default;
import styles from "../styles/Compress.module.css";

const { Dragger } = Upload;

const uploadProps: UploadProps = {
  name: "file",
  multiple: true,
  action: process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT,
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

export default function Compress() {
  return (
    <div className={styles.container}>
      <Head>
        <title>PDF24 Tools - Compress PDF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>PDF24 Tools</div>
        <nav className={styles.nav}>
          <a href="#">Desktop Version</a>
          <a href="#">Contact</a>
          <a href="#">All PDF Tools</a>
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Compress PDF</h1>
        <p className={styles.description}>
          PDF compressor to reduce the size of PDF files quickly and easily
        </p>

        <div className={styles.uploadSection}>
          <p className={styles.step}>1. Upload your PDFs</p>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </div>

        <section className={styles.information}>
          <h2>Information</h2>
          <div className={styles.platforms}>
            <span>Windows</span>
            <span>Linux</span>
            <span>MAC</span>
            <span>iPhone</span>
            <span>Android</span>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>How to compress PDF files</h3>
              <p>PDF24 makes it easy and fast to compress PDF files.</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Adjustable quality</h3>
              <p>Set the compression quality to fit your needs.</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Easy to use</h3>
              <p>Compress PDF files quickly and easily.</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Run on your system</h3>
              <p>Compress PDF files locally on your system.</p>
            </div>
            <div className={styles.infoCard}>
              <h3>No installation required</h3>
              <p>Use the tool directly in your browser.</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Secure online compression</h3>
              <p>Compress PDF files securely online.</p>
            </div>
          </div>
        </section>

        <section className={styles.faq}>
          <h2>FAQ</h2>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <a href="#">Merge PDF</a>
            <a href="#">Split PDF</a>
            <a href="#">Compress PDF</a>
            <a href="#">Edit PDF</a>
            <a href="#">PDF Converter</a>
            <a href="#">Convert to PDF</a>
            <a href="#">Extract PDF pages</a>
            <a href="#">Create PDF</a>
            <a href="#">Add page numbers</a>
            <a href="#">Rotate PDF</a>
            <a href="#">Delete PDF pages</a>
            <a href="#">Sort PDF pages</a>
            <a href="#">Sign PDF</a>
            <a href="#">PDF Reader</a>
            <a href="#">Protect PDF</a>
            <a href="#">Unlock PDF</a>
            <a href="#">PDF to Word</a>
            <a href="#">PDF to Excel</a>
            <a href="#">PDF to PowerPoint</a>
            <a href="#">PDF to JPG</a>
            <a href="#">JPG to PDF</a>
            <a href="#">Word to PDF</a>
            <a href="#">Excel to PDF</a>
            <a href="#">PowerPoint to PDF</a>
            <a href="#">PDF OCR</a>
            <a href="#">PDF to Text</a>
            <a href="#">PDF to eBook</a>
            <a href="#">Remove PDF pages</a>
            <a href="#">Add watermark</a>
            <a href="#">Reduce PDF file size</a>
          </div>
          <div className={styles.legal}>
            <a href="#">Legal Notice</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Privacy Settings</a>
          </div>
          <p>&copy; 2024 Geek Software GmbH</p>
        </footer>
      </main>
    </div>
  );
}
