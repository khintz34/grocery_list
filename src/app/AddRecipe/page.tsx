"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";

export default function AddRecipe() {
  const [category, setCategory] = useState("Baby Food");

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
      <form action="">
        <div className={styles.inputContainer}>
          <label htmlFor="name" className={styles.label}>
            Recipe Name
          </label>
          <input type="text" name="name" id="name" />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="categorySel" className={styles.label}>
            Category
          </label>
          <select
            name="categorySel"
            onChange={(e) => {
              writeUserData(e);
              //   add();
              setCategory(e.target.value);
            }}
            defaultValue={"Baby Food"}
            className={styles.select}
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
      </form>
    </main>
  );
}
