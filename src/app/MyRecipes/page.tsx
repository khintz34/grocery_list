"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import { HeaderContext } from "@/contexts/authContext";
import { FoodListObj } from "@/assets/FoodList";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import MyListItem from "@/Components/MyListItem/MyListItem";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";

export default function MyRecipes() {
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, [refresh]);

  useEffect(() => {
    setHeaderText("My Recipes");
  }, []);

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

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  function handleState(value: Array<FoodListObj>) {
    setFoodList([...value]);
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
