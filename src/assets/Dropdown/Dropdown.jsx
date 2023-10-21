import React from "react";
import { CategoryList } from "../CategoryList";
import styles from "./Dropdown.module.scss";

function Dropdown({ onChange, firstOpt }) {
  return (
    <select
      onChange={onChange}
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
