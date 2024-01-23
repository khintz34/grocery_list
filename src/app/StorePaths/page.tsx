"use client";

import styles from "./page.module.css";
import { child, ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { HeaderContext } from "@/contexts/authContext";
import { isIndexSignatureDeclaration } from "typescript";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Store from "@/Components/Store/Store";
import AddPathContainer from "@/Components/AddPathContainer/AddPathContainer";
import { StorePathObj } from "@/assets/StorePathObj";

export default function Home() {
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [shoppingOrder, setShoppingOrder] = useState<string>("Default");
  const [shoppingOrderArray, setShoppingOrderArray] = useState<Array<any>>([]);
  const [storePaths, setStorePaths] = useState<Array<StorePathObj>>([]);

  useEffect(() => {
    setHeaderText("My Store Path");
  }, []);

  function handleRefresh(value: boolean) {
    setRefresh(value);
    getShoppingOrderLists();
  }

  useEffect(() => {
    getShoppingOrderLists();
  }, []);

  async function getShoppingOrderLists() {
    const Ref = databaseRef(db, `ShoppingOrderList/`);
    let displayArray: Array<any> = [];
    let pathArray: Array<StorePathObj> = [];
    onValue(
      Ref,
      (snapshot) => {
        snapshot.forEach((childSnapShot) => {
          const childKey = childSnapShot.key;
          const childData = childSnapShot.val();
          let pathObj = {
            storeName: childKey,
            path: childData,
          };
          pathArray.push(pathObj);
          let obj = {
            store: childKey,
            path: childData,
          };
          displayArray.push(obj);
        });
        setShoppingOrderArray(displayArray);
        setStorePaths(pathArray);
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
          console.log(store);
          return (
            <Store
              store={store}
              index={index}
              key={`store-${store.store}-${index}`}
            />
          );
        })}
      </div>
      <AddPathContainer
        refresh={handleRefresh}
        refVal={refresh}
        reset={() => console.log("reset")}
        pathArray={storePaths}
      />
    </main>
  );
}
