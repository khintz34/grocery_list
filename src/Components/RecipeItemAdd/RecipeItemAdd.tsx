"use client";
import styles from "./RecipeItemAdd.module.css";
import React, { useState } from "react";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";

export default function RecipeItemAdd() {
  const [category, setCategory] = useState("Baby Food");

  return (
    <main className={styles.main}>
      <div className={styles.inputContainer}>
        <label htmlFor="name" className={styles.label}>
          Ingredient:
        </label>
        <input type="text" name="name" id="name" className={styles.input} />
      </div>
      <div className={`${styles.inputContainer} `}>
        <label htmlFor="categorySel" className={styles.label}>
          Category:
        </label>
        <select
          id="categorySel"
          onChange={(e) => {
            //   add();
            setCategory(e.target.value);
          }}
          defaultValue={"Baby Food"}
          className={styles.input}
        >
          {CategoryList.map((option, index) => (
            <option key={index} value={option} className={`${styles.option} `}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className={`${styles.inputContainer} `}>
        <label htmlFor="note" className={styles.label}>
          Note:
        </label>
        <input type="text" name="note" id="note" className={styles.input} />
      </div>
    </main>
  );
}
