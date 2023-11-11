"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";

export default function AddRecipe() {
  const [category, setCategory] = useState("Baby Food");
  const [ingredientCount, setIngredientCount] = useState<number>(1);
  // todo add component for ingredient. Each ingredient should have name, category, note
  //todo create an array to add all ingredients to
  //todo add a button that will push all info to RecipeList

  function writeUserData(e) {
    e.preventDefault();

    const database = getDatabase();
    set(ref(database, "FoodList/" + name), {
      Name: name,
      Category: e.target.value,
    }).catch((error) => {
      console.log("Uploaded Unsuccessfully... try again. ");
    });
  }

  return (
    <main className={styles.main}>
      <form action="" className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="name" className={styles.label}>
            Recipe Name
          </label>
          <input type="text" name="name" id="name" className={styles.input} />
        </div>
        <div className={`${styles.inputContainer} `}>
          <label htmlFor="categorySel" className={styles.label}>
            Category
          </label>
          <select
            id="categorySel"
            onChange={(e) => {
              writeUserData(e);
              //   add();
              setCategory(e.target.value);
            }}
            defaultValue={"Baby Food"}
            className={styles.input}
          >
            {CategoryList.map((option, index) => (
              <option
                key={index}
                value={option}
                className={`${styles.option} `}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={`${styles.inputContainer} `}></div>
      </form>
    </main>
  );
}
