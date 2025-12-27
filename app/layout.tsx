import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import AuthProvider from "../components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Simple note-taking app",
  openGraph: {
    title: "NoteHub",
    description: "Simple note-taking app",
    url: "https://notehub.app",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main className="rootMain">{children}</main>
            <Footer />
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
