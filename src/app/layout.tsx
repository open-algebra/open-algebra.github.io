import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/iosevka/500.css";
import "@fontsource/iosevka/600.css";
import "@fontsource/iosevka/700.css";
import "@/styles/globals.css";
import Script from "next/script";
import CookieDisclaimer from "@/components/CookieDisclaimer";

export const metadata: Metadata = {
  title: "Oasis",
  description: "Open Algebra Software for Inferring Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <CookieDisclaimer />
      {children}
      <Script id="clarity-script" strategy="afterInteractive">
        {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
        `}
      </Script>
      </body>
    </html>
  );
}
