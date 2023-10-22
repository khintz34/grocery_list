"use client";

import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect } from "react";
import { FoodListObj } from "@/assets/FoodList";
import Dropdown from "../../assets/Dropdown/Dropdown";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    setFoodList([]);
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
    }
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        return (
          <div
            key={`${val}-${index}`}
            className={styles.foodContainer}
            onChange={() => console.log("changed")}
          >
            <div className={styles.foodName}>{val.name}</div>
            <Dropdown
              firstOpt={val.category}
              name={val.name}
              counter={() => setFoodList(foodList)}
              list={foodList}
            />
          </div>
        );
      })}
    </main>
  );
}
