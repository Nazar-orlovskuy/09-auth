import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub — Page not found",
  description: "The requested page does not exist on NoteHub.",
  openGraph: {
    title: "NoteHub — Page not found",
    description: "The requested page does not exist on NoteHub.",
    url: "https://notehub.app/404",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFoundPage() {
  return (
    <>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 700,
          margin: "0 auto",
          color: "#1a1a1a",
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        404 - Page not found
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#444444",
          lineHeight: "28px",
          textAlign: "center",
        }}
      >
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
