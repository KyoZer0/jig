import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JIGSOLITAIRE GAME",
  description: "A playful puzzle game with bold yellow accents and tactile puzzle pieces",
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
