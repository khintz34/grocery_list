"use client";

import styles from "./page.module.css";
import { child, ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { HeaderContext } from "@/contexts/authContext";
import { isIndexSignatureDeclaration } from "typescript";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Store from "@/Components/Store/Store";

export default function Home() {
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [shoppingOrder, setShoppingOrder] = useState<string>("Default");
  const [shoppingOrderArray, setShoppingOrderArray] = useState<Array<any>>([]);
  const [down, setDown] = useState(true);
  const [hidden, setHidden] = useState(`${styles.hide}`);

  function handleToggle() {
    if (down) {
      setDown(false);
      setHidden(`${styles.show}`);
    } else {
      setDown(true);
      setHidden(`${styles.hide}`);
    }
  }

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
      <div className={styles.paths}>
        {shoppingOrderArray.map((store, index) => {
          return (
            <Store
              store={store}
              index={index}
              key={`store-${store.store}-${index}`}
            />
          );
        })}
      </div>
    </main>
  );
}
