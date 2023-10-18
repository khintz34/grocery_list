"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useReducer,
  useState,
} from "react";
import { Inter } from "next/font/google";
import Header from "../Components/Header/Header.tsx";

const inter = Inter({ subsets: ["latin"] });

interface IAuthContext {
  auth: Boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<IAuthContext>({
  auth: false,
  setAuth: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, setAuth] = useState<boolean>(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <Header />
          {children}
        </AuthContext.Provider>
      </body>
    </html>
  );
};
