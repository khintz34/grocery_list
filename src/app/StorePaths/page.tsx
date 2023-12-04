"use client";

import styles from "./page.module.css";
import { child, ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { HeaderContext } from "@/contexts/authContext";
import { isIndexSignatureDeclaration } from "typescript";

export default function Home() {
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [shoppingOrder, setShoppingOrder] = useState<string>("Default");
  const [shoppingOrderArray, setShoppingOrderArray] = useState<Array<any>>([]);

  useEffect(() => {
    getShoppingOrderLists();
  }, [refresh]);

  useEffect(() => {
    setHeaderText("My Store Path");
  }, []);

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  async function getShoppingOrderLists() {
    const Ref = databaseRef(db, `ShoppingOrderList/`);
    let displayArray: Array<any> = [];
    onValue(
      Ref,
      (snapshot) => {
        snapshot.forEach((childSnapShot) => {
          const childKey = childSnapShot.key;
          const childData = childSnapShot.val();
          console.log(childData);
          let obj = {
            store: childKey,
            path: childData,
          };
          displayArray.push(obj);
        });
        setShoppingOrderArray(displayArray);
      },
      {
        onlyOnce: false,
      }
    );
  }

  return (
    <main className={styles.main}>
      My Store Paths:
      <div>
        {shoppingOrderArray.map((val, index) => {
          return (
            <div key={index}>
              {val.store}
              {val.path}
            </div>
          );
        })}
      </div>
    </main>
  );
}