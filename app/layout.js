"use client";
import { UserProvider } from "@/lib/UserContext";

// export const metadata = {
//   title: "Quickie",
//   description: "Quickie Web",
// };

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html
        lang="en"
        className="[&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Quickie</title>
        </head>
        <body>{children}</body>
      </html>
    </UserProvider>
  );
}
