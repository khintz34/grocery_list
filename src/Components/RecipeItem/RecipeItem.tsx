"use client";
import React, { useEffect, useState } from "react";
import styles from "./RecipeItem.module.scss";
import { BsCheckCircle } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
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
