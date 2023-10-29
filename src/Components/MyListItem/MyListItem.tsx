"use client";
import React, { useState } from "react";
import styles from "./MyListItem.module.scss";
import { BsCheckCircle } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";

// todo add note aspect to myList Datatype
// todo when adding to MyList need to add a blank note
// todo on input Change update note
interface Props {
  name: string;
  category: string;
  list: Array<FoodListObj>;
  removeItem: Function;
}

export default function MyListItem(props: Props) {
  const [inputStatus, setInputStatus] = useState(styles.hide);

  function handleStatusClick() {
    if (inputStatus === styles.show) {
      setInputStatus(styles.hide);
    } else {
      setInputStatus(styles.show);
    }
  }

  function removeDataFromMyList() {
    let newList = props.list;
    const index = newList.map((e) => e.name).indexOf(props.name);
    newList.splice(index, 1);

    const database = getDatabase();
    remove(ref(database, "MyList/" + props.name))
      .then(() => {
        console.log(name, "deleted from MyList");
      })
      .catch((error) => {
        console.log(name, "not deleted from MyList");
      });

    props.removeItem(newList);
  }

  return (
    <main className={styles.main}>
      <p className={styles.pName}>{props.name}</p>
      <div className={`${styles.inputContainer} ${inputStatus}`}>
        <input type="text" className={styles.input} />
      </div>
      <div className={styles.iconContainer}>
        <TfiWrite onClick={handleStatusClick} />
        <BsCheckCircle onClick={removeDataFromMyList} />
      </div>
    </main>
  );
}
