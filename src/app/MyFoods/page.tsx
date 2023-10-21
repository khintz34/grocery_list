"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FoodListObj } from "@/assets/FoodList";
import { CategoryList } from "@/assets/CategoryList";
import Dropdown from "../../assets/Dropdown/Dropdown";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    getUserData();
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
          //   console.log(childData);
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
          <div key={`${val}-${index}`} className={styles.foodContainer}>
            <div>{val.name}</div>
            <Dropdown
              onChange={() => console.log({ val })}
              firstOpt={val.category}
              name={val.name}
            />
          </div>
        );
      })}
    </main>
  );
}
