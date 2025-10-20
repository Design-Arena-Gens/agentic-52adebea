import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Product Research Agent",
  description: "Autonomous research agent for digital product creation and trend analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
