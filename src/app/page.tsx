"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../assets/firebase";
import { useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

export default function Home() {
  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    let holdingArray: Array<string> = [];
    const boardRef = databaseRef(db, "FoodList/");
    let displayArray: Array<any> = [];
    onValue(
      boardRef,
      (snapshot) => {
        snapshot.forEach((childSnapShot) => {
          const childKey = childSnapShot.key;
          const childData = childSnapShot.val();
          console.log(childData);
          let obj = {
            name: childData.name,
            category: childData.category,
          };
          addData(obj);
        });
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: any) {
      // displayArray.push(obj);
      // setMemoryList([...displayArray]);
      console.log(obj);
    }
  }

  return <main className={styles.main}>test</main>;
}
