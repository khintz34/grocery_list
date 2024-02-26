"use client";
import React, { useEffect, useState } from "react";
import styles from "./MyListItem.module.scss";
import { BsCheckCircle } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { db } from "../../assets/firebase";
import { getDatabase, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import { IconContext } from "react-icons";

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
  const [noteVal, setNoteVal] = useState<string>(props.note);
  const iconStyles = { color: "blue" };

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
    props.refresh(!props.refVal);
  }

  function updateNote() {
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
          onChange={(e) => setNoteVal(e.target.value)}
          name={`noteInput-${props.name}`}
        />
      </div>
      <div className={styles.iconContainer}>
        <IconContext.Provider value={{ className: "scale" }}>
          <TfiWrite onClick={handleStatusClick} className={styles.scale} />
          <BsCheckCircle
            onClick={removeDataFromMyList}
            className={styles.scale}
          />
        </IconContext.Provider>
      </div>
    </main>
  );
}
