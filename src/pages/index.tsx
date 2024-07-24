import Head from "next/head";
import { useState } from "react";
import { Upload, message, Slider, Switch, Button, InputNumber } from "antd";
import type { UploadProps } from "antd";
const InboxOutlined =
  require("@ant-design/icons/lib/icons/InboxOutlined").default;
import styles from "../styles/Compress.module.css";
import Footer from "../components/Footer";

const { Dragger } = Upload;

interface CompressedFile {
  name: string;
  jobId: string;
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
        <div className={styles.logo}>PDF24 Tools</div>
        <nav className={styles.nav}>
          <a href="#">Desktop Version</a>
          <a href="#">Contact</a>
          <a href="#">All PDF Tools</a>
          <Switch
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </nav>
      </header>

      <main className={`${styles.main} ${darkMode ? styles.dark : ""}`}>
        <h1 className={styles.title}>Compress PDF</h1>
        <p className={styles.description}>
          PDF compressor to reduce the size of PDF files quickly and easily
        </p>

        {step === 1 && (
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
        )}

        {step === 2 && (
          <div className={styles.compressionSection}>
            <p className={styles.step}>2. Choose compression</p>
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
            <p>Your files are ready</p>
            {compressedFiles.length > 0 ? (
              compressedFiles.map((file) => (
                <div key={file.name} className={styles.file}>
                  <p>{file.name}</p>
                  <Button onClick={() => handleDownload(file.name, file.jobId)}>
                    Download
                  </Button>
                  <Button onClick={() => console.log("Preview")}>
                    Preview
                  </Button>
                  <Button onClick={() => console.log("Continue")}>
                    Continue in another tool
                  </Button>
                </div>
              ))
            ) : (
              <p>No compressed files available.</p>
            )}
          </div>
        )}

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
      </main>
      <Footer />
    </div>
  );
};

export default Compress;
