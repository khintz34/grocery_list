"use client";

import React, { useState, useEffect } from "react";
import styles from "./Recipe.module.scss";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FoodListObj } from "@/assets/FoodList";
import RecipeItem from "../RecipeItem/RecipeItem";

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
  return (
    <div>
      <div className={`${styles.foodItemContainer}`}>
        <div className={styles.nameContainer}>
          <div className={styles.name}>{props.recipeName}</div>
          <div onClick={handleToggle}>
            {down ? <FaCaretDown /> : <FaCaretUp />}
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
