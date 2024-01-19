import React, { useState, useEffect } from "react";
import styles from "./AddPathContainer.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { StorePathObj } from "@/assets/StorePathObj";
import { constants } from "fs";

interface Props {
  refresh: Function;
  refVal: boolean;
  reset: Function;
  pathArray: Array<StorePathObj>;
}

//todo refresh after adding a new category to a list

export default function AddPathContainer(props: Props) {
  const [storeName, setStoreName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
  const [methodAdd, setMethodAdd] = useState<boolean>(true);
  const [storeLength, setStoreLength] = useState<number>(0);

  type CategoryObjext = { [key: string]: string };

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

    addCateogryToList(checkForStore(storeName));
  }

  function checkForStore(storeName: String) {
    for (let i = 0; i < props.pathArray.length; i++) {
      if (
        props.pathArray[i].storeName.toLocaleUpperCase() ===
        storeName.toLocaleUpperCase()
      ) {
        setStoreLength(props.pathArray[i].path.length);
        return props.pathArray[i].path.length;
      }
    }

    return 0;
  }

  function addCateogryToList(nextNum: number) {
    let key = nextNum.toString();
    let obj = {} as CategoryObjext;
    obj[key] = category;
    set(ref(db, "ShoppingOrderList/" + storeName + "/" + key), category)
      .then(() => {
        console.log(".then here");
        props.refresh(!props.refVal);
        setStoreName("");
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
              onChange={(e) => setStoreName(e.target.value.toLocaleUpperCase())}
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
              onChange={(e) => setCategory(e.target.value.toUpperCase())}
              value={category}
              maxLength={30}
              id="category"
            />
          </div>
          <div className={styles.inputContainer}>
            <legend className={styles.label}>Method:</legend>
            <div className={styles.methodContainer}>
              <div className={styles.method}>
                <label htmlFor="methodAdd">Add</label>
                <input
                  type="radio"
                  id="methodAdd"
                  checked={methodAdd}
                  onChange={() => setMethodAdd(true)}
                />
              </div>
              <div className={styles.method}>
                <label htmlFor="methodRemove">Remove</label>
                <input
                  type="radio"
                  id="methodRemove"
                  checked={!methodAdd}
                  onChange={() => setMethodAdd(false)}
                />
              </div>
            </div>
          </div>
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
