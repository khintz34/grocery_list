"use client";
import React, { useEffect, useState } from "react";
import styles from "./MyListItem.module.scss";
import { BsCheckCircle } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { db } from "../../assets/firebase";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { BooleanLiteral } from "typescript";

// todo on input Change update note. this is overriding when clicking on it
interface Props {
  name: string;
  category: string;
  note: string;
  list: Array<FoodListObj>;
  removeItem: Function;
  refresh: Function;
  refVal: boolean;
}

export default function MyListItem(props: Props) {
  const [inputStatus, setInputStatus] = useState(
    `${props.note === "" ? styles.hide : styles.show}`
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const [noteVal, setNoteVal] = useState<string>(props.note);

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
    remove(ref(database, "MyList/" + props.name)).catch((error) => {
      console.log(props.name, "not deleted from MyList");
    });

    props.removeItem(newList);
  }

  function updateNote() {
    console.log("update note", noteVal);
    set(ref(db, "MyList/" + props.name), {
      Name: props.name,
      Category: props.category,
      Note: noteVal,
    });
  }

  useEffect(() => {
    const delayUpdate = setTimeout(() => {
      updateNote();
    }, 3000);

    return () => clearTimeout(delayUpdate);
  }, [noteVal]);

  return (
    <main className={styles.main}>
      <p className={styles.pName}>{props.name}</p>
      <div className={`${styles.inputContainer} ${inputStatus}`}>
        <input
          type="text"
          className={styles.input}
          defaultValue={props.note}
          //   value={noteVal}
          onChange={(e) => setNoteVal(e.target.value)}
          //   onChange={(e) => updateNote(e.target.value)}
        />
      </div>
      <div className={styles.iconContainer}>
        <TfiWrite onClick={handleStatusClick} />
        <BsCheckCircle onClick={removeDataFromMyList} />
      </div>
    </main>
  );
}
