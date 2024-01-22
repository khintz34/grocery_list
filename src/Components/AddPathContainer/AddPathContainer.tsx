import React, { useState, useEffect } from "react";
import styles from "./AddPathContainer.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { StorePathObj } from "@/assets/StorePathObj";
import { constants } from "fs";

interface Props {
  refresh: Function;
  refVal: boolean;
  reset: Function;
  pathArray: Array<StorePathObj>;
}

//todo set List in parent via passed prop after reorder

export default function AddPathContainer(props: Props) {
  const [storeName, setStoreName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
  const [methodAdd, setMethodAdd] = useState<boolean>(true);

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

  function addCateogryToList(nextNum: number) {
    let key = nextNum.toString();
    let obj = {} as CategoryObjext;
    obj[key] = category;
    set(ref(db, "ShoppingOrderList/" + storeName + "/" + key), category)
      .then(() => {
        props.refresh(!props.refVal);
        setCategory("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function checkForStore(storeName: String) {
    for (let i = 0; i < props.pathArray.length; i++) {
      if (
        props.pathArray[i].storeName.toLocaleUpperCase() ===
        storeName.toLocaleUpperCase()
      ) {
        return props.pathArray[i].path.length;
      }
    }

    return 0;
  }

  function removeUserData(e: any) {
    e.preventDefault();
    let found: Array<number> = returnStoreIndex(storeName);

    if (found[0] > 0) {
      if (found[1] < found[2]) removeCategoryFromList(found);
    }
  }

  async function removeCategoryFromList(found: Array<number>) {
    let key = found[1].toString();
    let newArray = reorderList(found);

    console.log(reorderList(found));

    const database = getDatabase();
    remove(ref(database, "ShoppingOrderList/" + storeName + "/" + key))
      .then(() => {
        reorderList(found);
        props.refresh(!props.refVal);
      })
      .catch((error) => {
        console.log(category, " not deleted from ", storeName);
      });
  }

  function returnStoreIndex(storeName: String) {
    for (let i = 0; i < props.pathArray.length; i++) {
      if (
        props.pathArray[i].storeName.toLocaleUpperCase() ===
        storeName.toLocaleUpperCase()
      ) {
        return [
          i,
          findCategory(i, props.pathArray[i].path.length),
          props.pathArray[i].path.length,
        ];
      }
    }

    return [0, 0, 0];
  }
  function findCategory(index: number, arrayLength: number) {
    for (let i = 0; i < arrayLength; i++) {
      if (props.pathArray[index].path[i] === category.toLocaleUpperCase()) {
        return i;
      }
    }

    return arrayLength + 1;
  }

  //todo
  function reorderList(found: Array<number>) {
    let storeIndex = found[0];
    let categoryIndex = found[1];
    let newArray: Array<CategoryObjext> = [];

    let filterArray = [...props.pathArray[storeIndex].path]
      .splice(categoryIndex, 1)
      .filter((element) => {
        return element != null;
      });

    for (let i = 0; i < filterArray.length; i++) {
      let obj = {} as CategoryObjext;
      let key = i;
      obj[key] = filterArray[i].toString();
      newArray.push(obj);
    }
    return newArray;
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
            onClick={(e) => {
              methodAdd ? writeUserData(e) : removeUserData(e);
            }}
            name="button"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </main>
  );
}
