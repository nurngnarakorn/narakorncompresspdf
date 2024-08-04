import Script from "next/script";
import styles from "../styles/Advertisement.module.css";

const Advertisement = () => {
  return (
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
  );
};

export default Advertisement;
