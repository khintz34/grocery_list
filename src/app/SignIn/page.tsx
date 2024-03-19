"use client";
import styles from "./page.module.scss";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/assets/firebase";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const { auth, setAuth } = useContext(AuthContext);
  const [password, setPassword] = useState<string>("");
  const [signInError, setSignInError] = useState<boolean>(false);
  const [currentAuth, setCurrentAuth] = useState(false);

  const signUserIn = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setAuth(true);
        setSignInError(false);
        console.log("signed in");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setAuth(false);
        setSignInError(true);

        if (errorCode === "auth/invalid-login-credentials") {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed up
              const user = userCredential.user;
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log("------here=====");
              console.log(errorCode, errorMessage);
              console.log("------done=====");
              // ..
            });
        }
      });
  };

  useEffect(() => {
    if (auth) {
      setCurrentAuth(true);
    }
  }, []);

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
            value={password}
          />
        </div>
        <button
          type="submit"
          className={styles.btn}
          onClick={(e) => {
            //todo replace this with sign in functionality from main page
            e.preventDefault();
            signUserIn();
          }}
        >
          {auth ? "Sign Out" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
