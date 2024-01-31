"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useReducer,
  useState,
} from "react";
import { Poppins } from "next/font/google";
import Header from "../Components/Header/Header";

const poppins = Poppins({ weight: ["100", "400", "800"], subsets: ["latin"] });

interface IAuthContext {
  auth: Boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<IAuthContext>({
  auth: false,
  setAuth: () => {},
});

interface IHeaderContext {
  headerText: string;
  setHeaderText: Dispatch<SetStateAction<string>>;
}

export const HeaderContext = createContext<IHeaderContext>({
  headerText: "My Grocery List",
  setHeaderText: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, setAuth] = useState<boolean>(false);
  const [headerText, setHeaderText] = useState<string>("My Grocery List");

  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <HeaderContext.Provider value={{ headerText, setHeaderText }}>
            <Header />
            {children}
          </HeaderContext.Provider>
        </AuthContext.Provider>
      </body>
    </html>
  );
};
