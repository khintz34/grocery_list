"use client";

import React, { useState, useEffect } from "react";
import styles from "./Recipe.module.scss";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FoodListObj } from "@/assets/FoodList";
import RecipeItem from "../RecipeItem/RecipeItem";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set, remove } from "firebase/database";

interface Props {
  recipeName: string;
  ingredientList: Array<FoodListObj>;
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
        </div>
      </div>
    </div>
  );
}
