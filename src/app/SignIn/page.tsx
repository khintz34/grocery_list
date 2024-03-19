"use client";
import styles from "./page.module.scss";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const { auth, setAuth } = useContext(AuthContext);
  const [password, setPassword] = useState<string>("");
  const [signInError, setSignInError] = useState<boolean>(false);
  const [currentAuth, setCurrentAuth] = useState(false);

  return (
    <main className={styles.main}>
      <form action="" className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            value={email}
          />
        </div>
        <button
          type="submit"
          className={styles.btn}
          onClick={(e) => {
            //todo replace this with sign in functionality from main page
            e.preventDefault();
            setAuth(!auth);
          }}
        >
          {auth ? "Sign Out" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
