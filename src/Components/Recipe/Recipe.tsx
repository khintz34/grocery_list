"use client";

import React, { useState, useEffect } from "react";
import styles from "./Recipe.module.scss";
import { FaCaretDown, FaCaretUp, FaTrash } from "react-icons/fa";
import { FoodListObj } from "@/assets/FoodList";
import RecipeItem from "../RecipeItem/RecipeItem";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { IconContext } from "react-icons";
import { BsTrash } from "react-icons/bs";
import { RecipeObj } from "@/assets/RecipeObj";

interface Props {
  recipeName: string;
  ingredientList: Array<FoodListObj>;
  removeItem: Function;
  list: Array<RecipeObj>;
  refresh: Function;
}

export default function Recipe(props: Props) {
  const [down, setDown] = useState(true);
  const [hidden, setHidden] = useState(`${styles.hide}`);

  function handleToggle() {
    if (down) {
      setDown(false);
      setHidden(`${styles.show}`);
    } else {
      setDown(true);
      setHidden(`${styles.hide}`);
    }
  }

  function addToList() {
    props.ingredientList.forEach((food, index) => {
      set(ref(db, "MyList/" + food.name), {
        Name: food.name,
        Category: food.category,
        Note: food.note,
      });
    });
  }

  function removeDataFromMyRecipes() {
    let newList = props.list;
    const index = newList.map((e) => e.recipeName).indexOf(props.recipeName);
    newList.splice(index, 1);

    const database = getDatabase();
    remove(ref(database, "RecipeList/" + props.recipeName)).catch((error) => {
      console.log(name, "not deleted from MyRecipes");
    });

    props.removeItem(newList);
    props.refresh(true);
  }

  return (
    <div>
      <div className={`${styles.foodItemContainer}`}>
        <div className={styles.nameContainer}>
          <p className={styles.name}>{props.recipeName}</p>
          <div className={styles.btnContainer}>
            <button className={styles.btn} onClick={addToList}>
              Add to List
            </button>
            <div onClick={handleToggle}>
              {down ? <FaCaretDown /> : <FaCaretUp />}
            </div>
          </div>
        </div>
        <div className={`${styles.foodItem} ${hidden}`}>
          {props.ingredientList.map((food, i) => {
            return (
              <RecipeItem key={`${food.name}-food-${i}`} foodItem={food} />
            );
          })}
          <button
            className={`${styles.btn} ${styles.delete}`}
            onClick={removeDataFromMyRecipes}
          >
            Delete Recipe
            <IconContext.Provider value={{ className: "deleteBtn" }}>
              <BsTrash className={styles.deleteBtn} />
            </IconContext.Provider>
          </button>
        </div>
      </div>
    </div>
  );
}
