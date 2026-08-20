import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Style DNA — Visual Style Parser",
  description: "Turn visual inspiration into reusable design language.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Style DNA — Visual Style Parser",
    description: "See the style. Understand the system. Reuse the DNA.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
