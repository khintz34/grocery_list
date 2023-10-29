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
  // todo sort food list by category

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, [refresh]);

  useEffect(() => {
    setHeaderText("My Grocery List");
  }, []);

  function handleRefresh(value: boolean) {
    console.log("Refeshing");
    setRefresh(value);
  }

  function handleState(value: Array<FoodListObj>) {
    console.log("handling state");
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
          // console.log(childData);
          let obj = {
            name: childData.Name,
            category: childData.Category,
            note: childData.Note,
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
      // console.log(obj);
    }
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        return (
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
        );
      })}
      <AddFoodContainer refresh={handleRefresh} refVal={refresh} path={true} />
    </main>
  );
}
