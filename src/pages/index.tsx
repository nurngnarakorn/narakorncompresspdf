import Head from "next/head";
import { useState } from "react";
import {
  Image,
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

  const handleFileChange = (info: any) => {
    const { status } = info.file;
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setSelectedFiles(info.fileList.map((file: any) => file.originFileObj));
      setStep(2); // Move to step 2 after files are uploaded
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

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
        <title>PDF24 Tools - Compress PDF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logoSection}>
          <span className={styles.logopdf24}>PDF24</span>
          <span className={styles.logotools}>Tools</span>
        </div>

        <div>
          <nav className={styles.nav}>
            <a href="#">Desktop Version</a>
            <a href="#">Contact</a>
            <Switch
              checked={darkMode}
              onChange={(checked) => setDarkMode(checked)}
              checkedChildren="Dark"
              unCheckedChildren="Light"
              style={{ marginLeft: "10px" }}
            />
            <a href="#">All PDF Tools</a>
          </nav>
        </div>
      </header>

      <div className={styles.blueStrip}>
        <div className={styles.blueStripContainer}>
          <div className={styles.stripContent} style={{ textAlign: "left" }}>
            <div className={styles.starRating}>
              <span>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <div className={styles.ratingText}>4.9 (8,381 votes)</div>
            </div>
          </div>
          <div className={styles.stripContent} style={{ textAlign: "right" }}>
            <span>Free</span>
            <span>Online</span>
            <span>No Limits</span>
          </div>
        </div>
      </div>

      <main className={`${styles.main} ${darkMode ? styles.dark : ""}`}>
        <div className={styles.topsection}>
          <div className={styles.logo} style={{ textAlign: "left" }}>
            Compress PDF
          </div>
          <p className={styles.description} style={{ textAlign: "left" }}>
            PDF compressor to reduce the size of PDF files quickly and easily
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
            <p>Your files are ready</p>
            {compressedFiles.length > 0 ? (
              compressedFiles.map((file) => (
                <div key={file.name} className={styles.file}>
                  <p>{file.name}</p>
                  <div className={styles.buttonGroup}>
                    <Button
                      className={styles.actionButton}
                      onClick={() => handleDownload(file.name, file.jobId)}
                    >
                      Download
                    </Button>
                    <Button
                      className={styles.actionButton}
                      onClick={() => handlePreview(file.url)}
                    >
                      Preview
                    </Button>
                    <Button
                      className={styles.actionButton}
                      onClick={() => console.log("Continue")}
                    >
                      Continue in another tool
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No compressed files available.</p>
            )}
          </div>
        )}

        <section className={styles.advertisement}>
          <h3>Advertisement</h3>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2877713589134666"
            crossOrigin="anonymous"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-2877713589134666"
            data-ad-slot="1474198615"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script
            id="adsense"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
            }}
          />
        </section>
      </main>

      <div className={styles.coversection}>
        <section className={styles.information}>
          <div className={styles.arial700}>Information</div>
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
              <p>
                Select your PDF files which you would like to compress or drop
                them into the file box and start the compression. A few seconds
                later you can download your compressed PDF files.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Adjustable quality</h3>
              <p>
                You can adjust the compression quality so that you can tune the
                compression algorithm in order to get a perfect result. PDF
                files with images can be compressed better than PDF files with
                text only.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Easy to use</h3>
              <p>
                PDF24 makes it as easy and fast as possible for you to compress
                your files. You don't need to install any software, you only
                have to select your files and start the compression.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Run on your system</h3>
              <p>
                The compression tool does not need any special system in order
                to compress your PDF files. The app is browser based and works
                under all operating systems.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>No installation required</h3>
              <p>
                You do not need to download and install any software. PDF files
                are compressed in the cloud on our servers. The app does not
                consume your system resources.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Secure online compression</h3>
              <p>
                The compression tool does not keep your files longer than
                necessary on our server. Your files and results will be deleted
                from our server after a short period of time.
              </p>
            </div>
          </div>
        </section>
      </div>

      <main className={`${styles.main} ${darkMode ? styles.dark : ""}`}>
        <section className={styles.faqSection}>
          <div className={styles.faqTitle}>
            <div className={styles.faqTitleBar}></div>
            <h2 className={styles.faqText}>FAQ</h2>
          </div>
        </section>
      </main>

      <main className={`${styles.main} ${darkMode ? styles.dark : ""}`}>
        <section className={styles.footerSection}>
          <Footer />
        </section>
      </main>

      <div className={styles.coversection}>
        <section className={styles.legalLinks}>
          <p>&copy; 2024 Geek Software GmbH</p>
        </section>
      </div>

      <Modal
        visible={previewVisible}
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
