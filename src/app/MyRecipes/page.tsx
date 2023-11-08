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
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

//create new component for recipe so each one has its own state

export default function MyRecipes() {
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [foodList, setFoodList] = useState<Array<RecipeObj>>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [down, setDown] = useState(true);
  const [hidden, setHidden] = useState(`${styles.hide}`);

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

  function handleToggle() {
    if (down) {
      setDown(false);
      setHidden(`${styles.show}`);
    } else {
      setDown(true);
      setHidden(`${styles.hide}`);
    }
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        console.log(val);
        return (
          <div key={`zero-${index}-${val.recipeName}`} onClick={handleToggle}>
            <div className={`${styles.foodItemContainer}`}>
              <div className={styles.nameContainer}>
                <div className={styles.name}>{val.recipeName}</div>
                <div>{down ? <FaCaretDown /> : <FaCaretUp />}</div>
              </div>
              <div className={`${styles.foodItem} ${hidden}`}>
                {val.ingredientList.map((food, i) => {
                  return <div key={`${food.name}-food-${i}`}>{food.name}</div>;
                })}
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
