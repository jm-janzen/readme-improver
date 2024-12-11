import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quack",
  description: "Because the world needs more ducks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
