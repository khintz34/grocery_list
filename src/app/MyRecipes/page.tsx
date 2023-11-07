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
  const [foodList, setFoodList] = useState<Array<RecipeObj>>();
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
          const childData = childSnapShot.val();
          let recipeArray: Array<RecipeObj> = [];
          let foodListArray: Array<FoodListObj> = [];

          //todo use this to create an obj
          //   repName should be the recipe name
          for (const prop in childData) {
            let item = childData[prop];
            // console.log(childData[prop]);
            let newObj = {
              name: item.Name,
              category: item.Category,
              note: item.Note,
            };

            foodListArray.push(newObj);
          }
          let obj = {
            recipeName: childKey,
            ingredientList: foodListArray,
          };
          //   console.log(obj);
          addData(obj);
        });
        // sortFoodList(displayArray);
        console.log(displayArray);
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: RecipeObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
    }

    // function sortFoodList(list: Array<RecipeObj>) {
    //   list?.sort((a: any, b: any) => (a.category > b.category ? 1 : -1));
    //   setFoodList(list);
    // }
  }

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  function handleState(value: Array<RecipeObj>) {
    setFoodList([...value]);
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        console.log(val);
        return (
          <div
            key={`zero-${index}-${val.recipeName}`}
            className={styles.foodItemContainer}
          >
            {val.recipeName}
          </div>
        );
      })}
    </main>
  );
}
