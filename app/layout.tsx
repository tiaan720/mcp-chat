import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { BotIdClient } from "botid/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mcpchat.scira.ai"),
  title: "Omni Chat",
  description:
    "Omni Chat is a minimalistic MCP client with a good feature set.",
  openGraph: {
    siteName: "Omni Chat",
    url: "https://mcpchat.scira.ai",
    images: [
      {
        url: "https://mcpchat.scira.ai/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omni Chat",
    description:
      "Omni Chat is a minimalistic MCP client with a good feature set.",
    images: ["https://mcpchat.scira.ai/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <BotIdClient
            protect={[
              {
                path: "/api/chat",
                method: "POST",
              }
            ]}
          />
        </head>
        <body className={`${inter.className}`}>
          <Providers>
            {children}
          </Providers>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
