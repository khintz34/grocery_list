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
import Recipe from "@/Components/Recipe/Recipe";

//create new component for recipe so each one has its own state
// add recipe container

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
          for (const prop in childData) {
            let item = childData[prop];

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
          addData(obj);
        });
        sortFoodList(displayArray);
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: RecipeObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
    }

    function sortFoodList(list: Array<RecipeObj>) {
      list?.sort((a: RecipeObj, b: RecipeObj) =>
        a.recipeName > b.recipeName ? 1 : -1
      );
      setFoodList(list);
    }
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
          <Recipe
            recipeName={val.recipeName}
            ingredientList={val.ingredientList}
            key={`zero-${index}-${val.recipeName}`}
          />
        );
      })}
    </main>
  );
}
