import localFont from "next/font/local";

export const metadata = {
  title: "Quickie",
  description: "Quickie Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
