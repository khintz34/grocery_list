import React, { useState, useEffect } from "react";
import styles from "./AddFoodContaner.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { storage, db } from "../../assets/firebase";
import { getDatabase, push, ref, set } from "firebase/database";
import { debug } from "console";

export default function AddFoodContainer() {
  // todo after add, trigger refresh? data is adding...
  // todo change how category is defaulted
  // todo foodname not getting blanked out after writeUserDate
  const [foodName, setFoodName] = useState<string>("");
  const [category, setCategory] = useState<string>(CategoryList[0]);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);

  useEffect(() => {
    if (foodName === undefined || foodName === "") {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [foodName]);

  function writeUserData(e: any) {
    e.preventDefault();

    set(ref(db, "FoodList/" + foodName), {
      Name: foodName,
      Category: category,
    })
      .then(() => {
        setFoodName("");
        setCategory("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
              onChange={(e) => setFoodName(e.target.value)}
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
              value={category}
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
          <button
            className={
              disabledBtn ? `${styles.disabledBtn}` : `${styles.button}`
            }
            disabled={disabledBtn}
            onClick={(e) => writeUserData(e)}
          >
            ADD
          </button>
        </div>
      </form>
    </main>
  );
}
