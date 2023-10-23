import React, { useState } from "react";
import { CategoryList } from "../CategoryList";
import styles from "./Dropdown.module.scss";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { BsPlusCircle, BsTrash } from "react-icons/bs";

function Dropdown({ firstOpt, name, add, list, removeItem }) {
  const [category, setCategory] = useState(firstOpt);

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

  function addDataToMyList() {
    const database = getDatabase();
    set(ref(database, "MyList/" + name), {
      Name: name,
      Category: category,
    })
      .then(() => {
        console.log("MyList updated successfully");
      })
      .catch((error) => {
        console.log("MyList Uploaded Unsuccessfully... try again. ");
      });
  }
  function removeDataFromMyFoods() {
    let newList = list;
    const index = newList.map((e) => e.name).indexOf(name);
    newList.splice(index, 1);

    //! this is not working

    const database = getDatabase();
    remove(ref(database, "FoodList/" + name))
      .then(() => {
        console.log(name, "deleted from MyFoods");
      })
      .catch((error) => {
        console.log(name, "not deleted from MyFoods");
      });

    removeItem(newList);
  }

  return (
    <div className={styles.selectDiv}>
      <select
        onChange={(e) => {
          writeUserData(e);
          add();
          setCategory(e.target.value);
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
      <BsPlusCircle onClick={addDataToMyList} />
      <BsTrash
        onClick={() => {
          removeDataFromMyFoods();
        }}
      />
    </div>
  );
}

export default Dropdown;
