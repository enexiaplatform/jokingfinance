"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function SiteAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (!measurementId || previousPathname.current === pathname) {
      return;
    }

    window.gtag?.("config", measurementId, {
      page_path: pathname,
    });
    previousPathname.current = pathname;
  }, [measurementId, pathname]);

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trackedElement = target.closest<HTMLElement>("[data-analytics-event]");

      if (!trackedElement) {
        return;
      }

      trackEvent(trackedElement.dataset.analyticsEvent ?? "cta_click", {
        cta_label:
          trackedElement.dataset.analyticsLabel ??
          trackedElement.textContent?.trim().slice(0, 80),
        cta_location: trackedElement.dataset.analyticsLocation,
        destination: trackedElement.getAttribute("href") ?? undefined,
      });
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
