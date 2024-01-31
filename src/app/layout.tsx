import "./globals.css";
import { Poppins } from "next/font/google";
import { AuthContextProvider } from "../contexts/authContext";

const poppins = Poppins({ weight: ["100", "400", "800"], subsets: ["latin"] });

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
      <body className={poppins.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
