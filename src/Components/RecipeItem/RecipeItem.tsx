"use client";
import React from "react";
import styles from "./RecipeItem.module.scss";
import { db } from "../../assets/firebase";
import { ref, set } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { BsPlusCircle } from "react-icons/bs";
import { IconContext } from "react-icons";

interface Props {
  foodItem: FoodListObj;
}

export default function RecipeItem(props: Props) {
  function addToMyList() {
    set(ref(db, "MyList/" + props.foodItem.name), {
      Name: props.foodItem.name,
      Category: props.foodItem.category,
      Note: props.foodItem.note,
    });
  }

  return (
    <main className={styles.main}>
      <div className={styles.propsContainer}>
        <p className={styles.pName}>{props.foodItem.name}</p>
        {props.foodItem.note !== "" ? (
          <p className={styles.pNote}>({props.foodItem.note})</p>
        ) : (
          <p className={styles.pNote}>{props.foodItem.note}</p>
        )}
      </div>
      <IconContext.Provider value={{ className: "circle" }}>
        <BsPlusCircle onClick={addToMyList} className={styles.circle} />
      </IconContext.Provider>
    </main>
  );
}
