import React, { useState, useEffect } from "react";
import styles from "./AddFoodContaner.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { storage, db } from "../../assets/firebase";
import { getDatabase, push, ref, set } from "firebase/database";
import { debug } from "console";
import { FoodListObj } from "@/assets/FoodList";

interface Props {
  refresh: Function;
  refVal: boolean;
  path: boolean;
  reset: Function;
  foodlistProp: Array<FoodListObj> | undefined;
}

export default function AddFoodContainer(props: Props) {
  const [foodName, setFoodName] = useState<string>("");
  const [category, setCategory] = useState<string>(CategoryList[0]);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
  const [foodNote, setFoodNote] = useState<string>("");

  // todo when adding, just add to foodList by pushing a new obj
  //todo list shouldnt overlap add container

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
      addMyList(e);
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

  function addMyList(e: any) {
    set(ref(db, "MyList/" + foodName), {
      Name: foodName,
      Category: category,
      Note: foodNote,
    })
      .then(() => {
        set(ref(db, "FoodList/" + foodName), {
          Name: foodName,
          Category: category,
        });
      })
      .then(() => {
        let newList: Array<FoodListObj> =
          props.foodlistProp === undefined ? [] : [...props.foodlistProp];
        let item = {} as FoodListObj;
        item.name = foodName;
        item.category = category;
        item.note = foodNote;
        newList.push(item);
        props.reset(newList);
      })
      .then(() => {
        setFoodName("");
        setFoodNote("");
        props.refresh(!props.refVal);
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
              id="foodName"
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className={styles.input}
              value={category}
              id="category"
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
          {props.path ? (
            <div className={styles.inputContainer}>
              <label htmlFor="foodNote" className={styles.label}>
                Note
              </label>
              <input
                type="text"
                placeholder="Note (amount/count/etc)"
                className={styles.input}
                onChange={(e) => setFoodNote(e.target.value)}
                value={foodNote}
                maxLength={30}
                id="foodNote"
              />
            </div>
          ) : (
            <div className={styles.hide}></div>
          )}
        </div>
        <div>
          <button
            className={
              disabledBtn ? `${styles.disabledBtn}` : `${styles.button}`
            }
            disabled={disabledBtn}
            onClick={(e) => writeUserData(e)}
            name="button"
          >
            ADD
          </button>
        </div>
      </form>
    </main>
  );
}
