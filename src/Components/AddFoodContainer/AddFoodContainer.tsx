import React, { useState, useEffect } from "react";
import styles from "./AddFoodContaner.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { storage, db } from "../../assets/firebase";
import { getDatabase, push, ref, set } from "firebase/database";
import { debug } from "console";

interface Props {
  refresh: Function;
  refVal: boolean;
  path: boolean;
}

export default function AddFoodContainer(props: Props) {
  const [foodName, setFoodName] = useState<string>("");
  const [category, setCategory] = useState<string>(CategoryList[0]);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);

  // todo handle adding to MyList --> the list being passed in is messing this up...may need two seperate addFoodContainers...
  // todo if MyList then add a note input

  useEffect(() => {
    if (foodName === undefined || foodName === "") {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [foodName]);

  function writeUserData(e: any) {
    e.preventDefault();

    if (props.path) {
      addMyList();
      // addFoodList();
    } else {
      addFoodList();
    }
  }

  function addFoodList() {
    set(ref(db, "FoodList/" + foodName), {
      Name: foodName,
      Category: category,
    })
      .then(() => {
        props.refresh(!props.refVal);
        setFoodName("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function addMyList() {
    set(ref(db, "MyList/" + foodName), {
      Name: foodName,
      Category: category,
      Note: "",
    })
      .then(() => {
        set(ref(db, "FoodList/" + foodName), {
          Name: foodName,
          Category: category,
        });
      })
      .then(() => {
        console.log(props.refresh);
        props.refresh(!props.refVal);
        setFoodName("");
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
              value={foodName}
              maxLength={30}
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
