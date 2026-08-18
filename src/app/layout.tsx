import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { studylinkArabic, studylinkMono } from "./fonts";
import { asset } from "@/lib/asset";

/* Brand naming law — 10-arabic/arabic-and-rtl.md §1–2:
   the mark is the Latin wordmark "StudyLink" in every context, Arabic included.
   The transliteration «ستا‌دي لينك» is rejected outright ("ستاد" reads as
   stadium); «ستدي لينك» exists only as a hidden ASO keyword, never as a
   displayed name. Arabic in the store listing is description, not brand name. */
export const metadata: Metadata = {
  metadataBase: new URL("https://studylink.app"),
  title: "StudyLink — معاينة تصميم التطبيق | UI/UX Showcase",
  description:
    "معاينة تفاعلية لواجهة تطبيق StudyLink — مذكرات وملخصات وأدوات مكتبية وطبية لطلبة جامعة المنصورة، مع توصيل أو استلام من المكتبة.",
  keywords: [
    "StudyLink",
    "مذكرات",
    "ملخصات",
    "أدوات مكتبية",
    "أدوات طبية",
    "توصيل",
    "جامعة المنصورة",
    "ستدي لينك",
  ],
  authors: [{ name: "StudyLink" }],
  applicationName: "StudyLink",
  manifest: asset("/site.webmanifest"),
  icons: {
    icon: [
      { url: asset("/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: asset("/favicon-16.png"), sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: asset("/apple-touch-icon.png"), sizes: "180x180" }],
  },
  openGraph: {
    title: "StudyLink — معاينة تصميم التطبيق",
    description:
      "معاينة تفاعلية لواجهة تطبيق StudyLink — سوق أكاديمي لطلبة جامعة المنصورة.",
    locale: "ar_EG",
    type: "website",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2EEE3" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1B2C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${studylinkArabic.variable} ${studylinkMono.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
