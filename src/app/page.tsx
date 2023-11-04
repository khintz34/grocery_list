"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FoodListObj } from "@/assets/FoodList";
import { HeaderContext } from "@/contexts/authContext";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";
import MyListItem from "@/Components/MyListItem/MyListItem";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  let prevCat = "";
  // todo display category for each item

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, [refresh]);

  useEffect(() => {
    setHeaderText("My Grocery List");
  }, []);

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  function handleState(value: Array<FoodListObj>) {
    setFoodList([...value]);
  }

  async function getUserData() {
    let holdingArray: Array<string> = [];
    const boardRef = databaseRef(db, "MyList/");
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
            note: childData.Note,
          };
          addData(obj);
        });
        sortFoodList(displayArray);
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: FoodListObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
    }

    function sortFoodList(list: Array<FoodListObj>) {
      list?.sort((a: any, b: any) => (a.category > b.category ? 1 : -1));
      setFoodList(list);
    }
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        if (index === 0) {
          return (
            <div
              key={`zero-${index}-${val.name}`}
              className={styles.foodItemContainer}
            >
              <div className={styles.catDisplay}>{val.category}</div>
              <MyListItem
                key={`${val.name}-${index}`}
                name={val.name}
                category={val.category}
                list={foodList}
                removeItem={handleState}
                note={val.note}
                refresh={handleRefresh}
                refVal={refresh}
              />
            </div>
          );
        } else {
          return val.category === foodList[index - 1].category ? (
            <MyListItem
              key={`${val.name}-${index}`}
              name={val.name}
              category={val.category}
              list={foodList}
              removeItem={handleState}
              note={val.note}
              refresh={handleRefresh}
              refVal={refresh}
            />
          ) : (
            <div
              key={`zero-${index}-${val.name}`}
              className={styles.foodItemContainer}
            >
              <div className={styles.catDisplay}>{val.category}</div>
              <MyListItem
                key={`${val.name}-${index}`}
                name={val.name}
                category={val.category}
                list={foodList}
                removeItem={handleState}
                note={val.note}
                refresh={handleRefresh}
                refVal={refresh}
              />
            </div>
          );
        }
      })}
      {/* todo fix list */}
      <AddFoodContainer
        refresh={handleRefresh}
        refVal={refresh}
        path={true}
        reset={handleState}
        foodlistProp={foodList}
      />
    </main>
  );
}
