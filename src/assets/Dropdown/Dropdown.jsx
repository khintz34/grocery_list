import React from "react";
import { CategoryList } from "../CategoryList";
import styles from "./Dropdown.module.scss";
import { getDatabase, push, ref, set } from "firebase/database";

function Dropdown({ firstOpt, name, counter }) {
  function writeUserData(e) {
    e.preventDefault();

    const database = getDatabase();
    set(ref(database, "FoodList/" + name), {
      Name: name,
      Category: e.target.value,
    })
      .then(() => {
        console.log("updated successfully");
      })
      .catch((error) => {
        console.log("Uploaded Unsuccessfully... try again. ");
      });
  }
  return (
    <select
      onChange={(e) => {
        writeUserData(e);
        counter();
      }}
      defaultValue={firstOpt}
      className={styles.select}
    >
      <option>{firstOpt}</option>
      {CategoryList.map((option, index) => (
        <option
          key={index}
          value={option}
          className={`${styles.option} ${
            option === firstOpt ? styles.hide : ""
          }`}
        >
          {option}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;
