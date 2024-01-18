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
  pathArray: Array<StorePathObj> | undefined;
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
    console.log(props);
  }, []);

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
    const checkStore: number = checkForStore(storeName);
    console.log("Check store: ", checkStore);

    if (checkStore > 0) {
      console.log("FOUND: ", storeName, " --> ", checkStore);
      addCateogryToList(checkStore);
    } else {
      console.log("NOT FOUND");
      addCateogryToList(checkStore);
    }
  }

  function checkForStore(storeName: String) {
    console.log(props.pathArray);
    for (let i = 0; i < props.pathArray.length; i++) {
      if (
        props.pathArray[i].storeName.toLocaleUpperCase() ===
        storeName.toLocaleUpperCase()
      ) {
        console.log(props.pathArray[i].path.length);
        setStoreLength(props.pathArray[i].path.length);
        return props.pathArray[i].path.length;
      }
    }

    return 0;
  }

  function addCateogryToList(nextNum: number) {
    console.log(nextNum);
    let key = nextNum.toString();
    let obj = {} as CategoryObjext;
    obj[key] = category;
    console.log(obj);
    set(ref(db, "ShoppingOrderList/" + storeName + "/" + key), category)
      .then(() => {
        props.refresh(!props.refVal);
        setStoreName("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // function addMyList(e: any) {
  //   set(ref(db, "MyList/" + foodName), {
  //     Name: foodName,
  //     Category: category,
  //     Note: foodNote,
  //   })
  //     .then(() => {
  //       set(ref(db, "FoodList/" + foodName), {
  //         Name: foodName,
  //         Category: category,
  //       });
  //     })
  //     .then(() => {
  //       let newList: Array<FoodListObj> =
  //         props.foodlistProp === undefined ? [] : [...props.foodlistProp];
  //       let item = {} as FoodListObj;
  //       item.name = foodName;
  //       item.category = category;
  //       item.note = foodNote;
  //       newList.push(item);
  //       props.reset(newList);
  //     })
  //     .then(() => {
  //       setFoodName("");
  //       setFoodNote("");
  //       props.refresh(!props.refVal);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

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
