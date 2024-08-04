import Head from "next/head";
import { useState } from "react";
import {
  Upload,
  message,
  Slider,
  Switch,
  Button,
  InputNumber,
  Modal,
  UploadProps,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Script from "next/script";
import styles from "../styles/Compress.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Dragger } = Upload;

interface CompressedFile {
  name: string;
  jobId: string;
  url: string; // Add a URL for previewing the file
}

const Compress = () => {
  const [step, setStep] = useState(1);
  const [compressionLevel, setCompressionLevel] = useState(75);
  const [dpi, setDpi] = useState(144);
  const [isColor, setIsColor] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [jobIds, setJobIds] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleCompress = async () => {
    if (selectedFiles.length === 0) return;

    const apiEndpoint = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;
    if (!apiEndpoint) {
      message.error("Backend API endpoint is not defined.");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Step 1: Upload Files
      const uploadResponse = await fetch(`${apiEndpoint}?action=upload`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies
      });

      if (!uploadResponse.ok) {
        message.error("Failed to upload files. Please try again.");
        return;
      }

      const uploadResult = await uploadResponse.json();
      console.log("uploadResult: ", uploadResult);

      if (!uploadResult || !uploadResult) {
        message.error("Unexpected response format from upload API.");
        return;
      }

      const uploadedFiles = uploadResult;

      // Step 2: Compress PDF
      const jobIds = await Promise.all(
        uploadedFiles.map(async (file: any) => {
          const compressResponse = await fetch(
            `${apiEndpoint}?action=compressPdf`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                files: [file],
                dpi: dpi,
                imageQuality: compressionLevel,
                mode: "normal",
                colorModel: isColor ? "RGB" : "Gray",
              }),
              credentials: "include", // Include cookies
            }
          );

          if (!compressResponse.ok) {
            throw new Error("Failed to compress files. Please try again.");
          }

          const compressResult = await compressResponse.json();
          console.log("compressResult: ", compressResult);

          if (!compressResult || !compressResult.jobId) {
            throw new Error("Unexpected response format from compress API.");
          }

          return compressResult.jobId;
        })
      );

      setJobIds(jobIds);
      setStep(3);

      // Step 3: Check Compression Status
      const checkStatus = async () => {
        const compressedFiles = await Promise.all(
          jobIds.map(async (jobId) => {
            const statusResponse = await fetch(
              `${apiEndpoint}?action=getStatus&jobId=${jobId}`,
              {
                credentials: "include", // Include cookies
              }
            );

            if (!statusResponse.ok) {
              throw new Error(
                "Failed to check compression status. Please try again."
              );
            }

            const statusResult = await statusResponse.json();
            console.log("statusResult: ", statusResult);

            if (statusResult.status === "done") {
              if (statusResult.job && statusResult.job["0.out.name"]) {
                return {
                  name: statusResult.job["0.out.name"],
                  jobId: jobId,
                  url: statusResult.job["0.out.url"], // Assuming the API returns a URL for preview
                };
              } else {
                throw new Error("No files found in compression result.");
              }
            } else {
              setTimeout(checkStatus, 2000); // Retry after 2 seconds
              return null;
            }
          })
        );

        setCompressedFiles(
          compressedFiles.filter((file) => file !== null) as CompressedFile[]
        );
      };

      checkStatus();
    } catch (error) {
      console.error("Error compressing files:", error);
      message.error("Failed to compress files. Please try again.");
    }
  };

  const handleDownload = async (fileName: string, jobId: string) => {
    const apiEndpoint = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;
    if (!apiEndpoint) {
      message.error("Backend API endpoint is not defined.");
      return;
    }

    try {
      const downloadResponse = await fetch(
        `${apiEndpoint}?action=downloadJobResult&mode=download&jobId=${jobId}`,
        {
          credentials: "include", // Include cookies
        }
      );

      if (!downloadResponse.ok) {
        message.error("Failed to download compressed file. Please try again.");
        return;
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Failed to download file. Please try again.");
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewVisible(true);
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
    setPreviewUrl("");
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT + "?action=upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setSelectedFiles(info.fileList.map((file: any) => file.originFileObj));
        setStep(2); // Move to step 2 after files are uploaded
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Compress PDF Master - Compress PDF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* <header className={styles.header}>
        <div className={styles.logoSection}>
          <span className={styles.logopdf24}>Compress PDF</span>
          <span className={styles.logotools}>Master</span>
        </div>

        <div>
          <nav className={styles.nav}>
            <a href="#">Desktop Version</a>
            <a href="/about">About Us</a>
            <a href="/help">Help</a>
            <a href="/contact">Contact</a>{" "}
            <Switch
              checked={darkMode}
              onChange={(checked) => setDarkMode(checked)}
              checkedChildren="Dark"
              unCheckedChildren="Light"
              style={{ marginLeft: "10px" }}
            />
            <a href="/legal">Legal Notice</a>
            <a href="/terms">Terms of Use</a>
            <a href="/privacy_policy">Privacy Policy</a>
          </nav>
        </div>
      </header> */}

      <main className={`${styles.main} ${darkMode ? styles.dark : ""}`}>
        <div className={styles.topsection}>
          <div className={styles.logo} style={{ textAlign: "left" }}>
            Introducing Compress PDF Master: Your Go-To PDF Compression Tool
          </div>
          <p className={styles.description} style={{ textAlign: "left" }}>
            Welcome to Compress PDF Master, the ultimate solution for all your
            PDF compression needs. Our state-of-the-art tool is designed to
            reduce the size of your PDF files quickly and efficiently, ensuring
            you maintain the highest quality.
          </p>
        </div>

        {step === 1 && (
          <div className={styles.uploadSection}>
            <div className={styles.stepsContainer}>
              <div className={`${styles.step} ${styles.activeStep}`}>
                1. Upload your PDFs
              </div>
              <div className={styles.step}>2. Choose compression</div>
              <div className={styles.step}>3. Done</div>
            </div>
            <Dragger {...uploadProps}>
              <div className={styles.draggerContent}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </div>
            </Dragger>
          </div>
        )}

        {step === 2 && (
          <div className={styles.compressionSection}>
            <div className={styles.stepsContainer}>
              <div className={styles.step}>1. Upload your PDFs</div>

              <div className={`${styles.step} ${styles.activeStep}`}>
                2. Choose compression
              </div>
              <div className={styles.step}>3. Done</div>
            </div>

            <Slider
              min={0}
              max={100}
              value={compressionLevel}
              onChange={setCompressionLevel}
            />
            <div className={styles.compressionSettings}>
              <p>DPI: </p>
              <InputNumber
                min={72}
                max={300}
                value={dpi}
                onChange={(value) => setDpi(value ?? 144)}
              />
              <p>Image quality: {compressionLevel}%</p>
              <Switch
                checked={isColor}
                onChange={setIsColor}
                checkedChildren="Color"
                unCheckedChildren="Gray"
              />
            </div>
            <Button type="primary" onClick={handleCompress}>
              Compress
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className={styles.downloadSection}>
            <div className={styles.stepsContainer}>
              <div className={styles.step}>1. Upload your PDFs</div>
              <div className={styles.step}>2. Choose compression</div>
              <div className={`${styles.step} ${styles.activeStep}`}>
                3. Done
              </div>
            </div>
            {compressedFiles.length > 0 ? (
              <>
                <p>Your files are ready</p>
                {compressedFiles.map((file) => (
                  <div key={file.name} className={styles.file}>
                    <p>{file.name}</p>
                    <div className={styles.buttonGroup}>
                      <Button
                        className={styles.actionButton}
                        onClick={() => handleDownload(file.name, file.jobId)}
                      >
                        Download
                      </Button>
                      {/* <Button
            className={styles.actionButton}
            onClick={() => handlePreview(file.url)}
          >
            Preview
          </Button> */}
                      {/* <Button
            className={styles.actionButton}
            onClick={() => console.log("Continue")}
          >
            Continue in another tool
          </Button> */}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>..</p>
            )}
          </div>
        )}

        <section className={styles.advertisement}>
          <h3>Advertisement</h3>
          <div>
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
              crossOrigin="anonymous"
            />
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
              data-ad-slot="1474198615"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </section>
      </main>

      <div className={styles.coversection}>
        <section className={styles.information}>
          <div className={styles.arial700}>Information</div>
          {/* <div className={styles.platforms}>
            <span>Windows</span>
            <span>Linux</span>
            <span>MAC</span>
            <span>iPhone</span>
            <span>Android</span>
          </div> */}
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>How to Compress PDF Documents</h3>
              <p>
                Upload your PDF documents that you wish to compress or drop them
                into the designated area. Within a few moments, you can download
                your compressed PDF files.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Customizable Quality</h3>
              <p>
                Adjust the compression quality to fine-tune the algorithm for
                the perfect result. PDF files with images can be compressed more
                effectively than those with only text.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Simple to Use</h3>
              <p>
                Compress PDF Master is designed to make compressing your files
                as easy and quick as possible. No software installation is
                required; just select your files and start compressing.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Operates on Your System</h3>
              <p>
                This compression tool does not require any special system to
                compress your PDF files. The application is browser-based and
                compatible with all operating systems.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>No Software Installation Needed</h3>
              <p>
                There is no need to download or install any software. PDF files
                are compressed in the cloud on our servers, ensuring that your
                system's resources are not consumed.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Secure Online Compression</h3>
              <p>
                Your files are only kept on our server for as long as necessary
                for the compression process. Once completed, both your files and
                the results will be deleted from our server after a short
                duration.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* <main className={`${styles.main} ${darkMode ? styles.dark : ""}`}>
        <section className={styles.faqSection}>
          <div className={styles.faqTitle}>
            <div className={styles.faqTitleBar}></div>
            <h2 className={styles.faqText}>FAQ</h2>
          </div>
        </section>
      </main> */}

      <Footer />

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handlePreviewClose}
        width="80%"
        style={{ top: 20 }}
      >
        <iframe
          src={previewUrl}
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      </Modal>
    </div>
  );
};

export default Compress;
