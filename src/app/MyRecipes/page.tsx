"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import { HeaderContext } from "@/contexts/authContext";
import { FoodListObj } from "@/assets/FoodList";
import { child, ref as databaseRef, onValue } from "firebase/database";
import { db } from "../../assets/firebase";
import MyListItem from "@/Components/MyListItem/MyListItem";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";
import { RecipeObj } from "@/assets/RecipeObj";

// todo create itemObj for recipe instead of using FoodListoBj
// each recipe will have multiple food list items in it

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
    const boardRef = databaseRef(db, "RecipeList/");
    let displayArray: Array<any> = [];
    onValue(
      boardRef,
      (snapshot) => {
        snapshot.forEach((childSnapShot) => {
          const childKey = childSnapShot.key;
          console.log(childKey);
          const childData = childSnapShot.val();
          let recipeArray: Array<RecipeObj> = [];

          //todo use this to create an obj
          //   repName should be the recipe name
          for (const prop in childData) {
            console.log(childData[prop]);
          }
          let obj = {
            reipeName: childKey,
            ingredientList: recipeArray,
          };
          console.log(obj);
          //   addData(obj);
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
        console.log(val);
        return (
          <div
            key={`zero-${index}-${val.name}`}
            className={styles.foodItemContainer}
          >
            {val.name}
          </div>
        );
      })}
    </main>
  );
}
