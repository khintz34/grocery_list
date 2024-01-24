import React, { useState, useEffect } from "react";
import styles from "./AddPathContainer.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { StorePathObj } from "@/assets/StorePathObj";

interface Props {
  refresh: Function;
  refVal: boolean;
  reset: Function;
  pathArray: Array<StorePathObj>;
}

export default function AddPathContainer(props: Props) {
  const [storeName, setStoreName] = useState<string>("");
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
  const [methodAdd, setMethodAdd] = useState<boolean>(true);

  type CategoryObjext = { [key: string]: string };

  useEffect(() => {
    if (storeName === undefined || storeName === "") {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [storeName]);

  function writeUserData(e: any) {
    e.preventDefault();
    addStore();
  }

  function addStore() {
    set(ref(db, "ShoppingOrderList/" + storeName + "/"), CategoryList)
      .then(() => {
        props.refresh(!props.refVal);
        setStoreName("");
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
        return true;
      }
    }

    return false;
  }

  function removeUserData(e: any) {
    e.preventDefault();

    removeStore();
  }

  async function removeStore() {
    const database = getDatabase();
    remove(ref(database, "ShoppingOrderList/" + storeName + "/"))
      .then(() => {
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
