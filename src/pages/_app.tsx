import "../styles/globals.css";
import "../styles/Page.module.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

const GTM_ID = "GTM-K6KMJ6Q3";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    const handleRouteChange = (url: string) => {
      window.dataLayer.push({
        event: "pageview",
        page: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K6KMJ6Q3"
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden",
          }}
        ></iframe>
      </noscript>
      <SpeedInsights />
    </>
  );
}

export default MyApp;
