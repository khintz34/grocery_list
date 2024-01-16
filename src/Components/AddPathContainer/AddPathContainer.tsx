import React, { useState, useEffect } from "react";
import styles from "./AddPathContainer.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";

interface Props {
  refresh: Function;
  refVal: boolean;
  path: boolean;
  reset: Function;
  foodlistProp: Array<FoodListObj> | undefined;
}

export default function AddPathContainer(props: Props) {
  const [storeName, setStoreName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
  const [methodAdd, setMethodAdd] = useState<boolean>(true);

  useEffect(() => {
    if (
      storeName === undefined ||
      storeName === "" ||
      category === undefined ||
      category === ""
    ) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [storeName, category]);

  function writeUserData(e: any) {
    e.preventDefault();

    if (props.path) {
      addMyList(e);
    } else {
      addFoodList();
    }
  }

  function addFoodList() {
    set(ref(db, "ShoppingOrderList/" + storeName), {
      Name: foodName,
      Category: category,
    })
      .then(() => {
        props.refresh(!props.refVal);
        setStoreName("");
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
            <label htmlFor="storeName" className={styles.label}>
              Store:
            </label>
            <input
              type="text"
              placeholder="Store Name"
              className={styles.input}
              onChange={(e) => setStoreName(e.target.value)}
              value={storeName}
              maxLength={30}
              id="storeName"
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="category" className={styles.label}>
              Category:
            </label>
            <input
              type="text"
              placeholder="Category"
              className={styles.input}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              maxLength={30}
              id="category"
            />
          </div>
          <div className={styles.inputContainer}>
            <legend className={styles.label}>Method:</legend>
            <label htmlFor="methodAdd">Add</label>
            <input
              type="radio"
              id="methodAdd"
              checked={methodAdd}
              onClick={() => setMethodAdd(true)}
            />
            <label htmlFor="methodRemove">Remove</label>
            <input
              type="radio"
              id="methodRemove"
              checked={!methodAdd}
              onClick={() => setMethodAdd(false)}
            />
          </div>
        </div>
        <div>
          <button
            className={
              disabledBtn ? `${styles.disabledBtn}` : `${styles.button}`
            }
            disabled={disabledBtn}
            // onClick={(e) => writeUserData(e)}
            name="button"
          >
            ADD
          </button>
        </div>
      </form>
    </main>
  );
}
