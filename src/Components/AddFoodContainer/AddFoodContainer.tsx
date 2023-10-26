import React, { useState } from "react";
import styles from "./AddFoodContaner.module.scss";
import { CategoryList } from "@/assets/CategoryList";

export default function AddFoodContainer() {
  const [foodName, setFoodName] = useState<string>();
  const [category, setCategory] = useState<string>();

  return (
    <main className={styles.main}>
      <form action="" className={styles.form}>
        <div className={styles.formInputs}>
          <div className={styles.inputContainer}>
            <label htmlFor="foodName" className={styles.label}>
              Food
            </label>
            <input
              type="text"
              placeholder="Food Name"
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="cateogry" className={styles.label}>
              Category
            </label>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
              }}
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
        </div>
        <div>
          <button className={styles.button}>ADD</button>
        </div>
      </form>
    </main>
  );
}
