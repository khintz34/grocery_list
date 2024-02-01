import React, { useState, useEffect } from "react";
import styles from "./AddFoodContaner.module.scss";
import { CategoryList } from "@/assets/CategoryList";
import { db } from "../../assets/firebase";
import { ref, set } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

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
  const [down, setDown] = useState(true);
  const [containerHeight, setContainerHeight] = useState(`${styles.short}`);

  function handleToggle() {
    if (down) {
      setDown(false);
      setContainerHeight(`${styles.short}`);
    } else {
      setDown(true);
      setContainerHeight(`${styles.tall}`);
    }
  }

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
      .then(() => {
        updateFoodList();
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
        updateFoodList();
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

  function updateFoodList() {
    let newList: Array<FoodListObj> =
      props.foodlistProp === undefined ? [] : [...props.foodlistProp];
    let item = {} as FoodListObj;
    item.name = foodName;
    item.category = category;
    item.note = foodNote;
    newList.push(item);
    props.reset(newList);
  }

  return (
    <main className={`${styles.main} ${containerHeight}`}>
      <div className={styles.dropContainer}>
        <h2>Add More Items</h2>
        <div onClick={handleToggle}>
          {down ? <FaCaretDown /> : <FaCaretUp />}
        </div>
      </div>
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
          <div
            className={`${props.path ? styles.inputContainer : styles.hide}`}
          >
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
