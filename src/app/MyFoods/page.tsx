"use client";

import styles from "./page.module.scss";
import { ref as databaseRef, onValue, ref } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { FoodListObj } from "@/assets/FoodList";
import Dropdown from "@/Components/Dropdown/Dropdown";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";
import { HeaderContext } from "@/contexts/authContext";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { headerText, setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, [refresh]);

  useEffect(() => {
    setHeaderText("My Foods");
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
            note: "",
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

  function handleState(value: Array<FoodListObj>) {
    setFoodList([...value]);
  }

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  return (
    <main className={styles.main}>
      <div className={styles.listContainer}>
        {foodList?.map((val, index) => {
          return (
            <div key={`${val}-${index}`} className={styles.foodContainer}>
              <div className={styles.foodName}>{val.name}</div>
              <Dropdown
                firstOpt={val.category}
                name={val.name}
                add={() => setFoodList([...foodList])}
                list={foodList}
                removeItem={handleState}
              />
            </div>
          );
        })}
      </div>
      <AddFoodContainer
        refresh={handleRefresh}
        refVal={refresh}
        path={false}
        reset={handleState}
        foodlistProp={[]}
      />
    </main>
  );
}
