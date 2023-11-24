"use client";
import styles from "./RecipeItemAdd.module.css";
import React, { useEffect, useState } from "react";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";

interface Props {
  num: number;
  onChange: Function;
}

export default function RecipeItemAdd(props: Props) {
  const [category, setCategory] = useState("Baby Food");
  const [num, setNum] = useState<number>(props.num);
  const [note, setNote] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    props.onChange(num, name, category, note);
  }, [name, category, note]);

  return (
    <main className={styles.main}>
      <div className={styles.inputContainer}>
        <label htmlFor="name" className={styles.label}>
          Ingredient:
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={styles.input}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={`${styles.inputContainer} `}>
        <label htmlFor="categorySel" className={styles.label}>
          Category:
        </label>
        <select
          id="categorySel"
          onChange={(e) => {
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
        <input
          type="text"
          name="note"
          id="note"
          className={styles.input}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </main>
  );
}
