import "./globals.css";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "../contexts/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grocery List",
  description: "Organized Grocery List",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
