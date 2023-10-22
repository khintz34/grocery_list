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
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, []);

  useEffect(() => {
    console.log(counter);
  }, [counter]);

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
      console.log("adding data", obj);
      if (foodList?.includes(obj)) {
        console.log("Food Already added");
      } else {
        displayArray.push(obj);
        setFoodList([...displayArray]);
      }
    }
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        // console.log(foodList);
        return (
          <div key={`${val}-${index}`} className={styles.foodContainer}>
            <div>{val.name}</div>
            <Dropdown
              firstOpt={val.category}
              name={val.name}
              counter={() => setFoodList([...foodList])}
            />
          </div>
        );
      })}
    </main>
  );
}
