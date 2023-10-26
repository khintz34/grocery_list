"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FoodListObj } from "@/assets/FoodList";
import { HeaderContext } from "@/contexts/authContext";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const { headerText, setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    getUserData();
    setHeaderText("My Grocery List");
  }, []);

  async function getUserData() {
    let holdingArray: Array<string> = [];
    const boardRef = databaseRef(db, "FoodList/");
    let displayArray: Array<any> = [];
    onValue(
      boardRef,
      (snapshot) => {
        snapshot.forEach((childSnapShot) => {
          const childKey = childSnapShot.key;
          const childData = childSnapShot.val();
          console.log(childData);
          let obj = {
            name: childData.Name,
            category: childData.Category,
          };
          addData(obj);
        });
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: FoodListObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
      console.log(obj);
    }
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        return (
          <div key={`${val}-${index}`}>
            {val.name} : {val.category}
          </div>
        );
      })}
    </main>
  );
}
