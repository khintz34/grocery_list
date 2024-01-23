import { useState } from "react";
import styles from "./StoreDropdown.module.scss";

interface Props {
  storeArray: Array<string>;
  changeCurrentStore: Function;
}

export function StoreDropdown({ storeArray, changeCurrentStore }: Props) {
  const [currentStore, setCurrentStore] = useState<string>(storeArray[0]);
  return (
    <div>
      <select
        onChange={(e) => {
          changeCurrentStore(e.target.value);
          setCurrentStore(e.target.value);
        }}
        value={currentStore}
        className={styles.select}
      >
        {storeArray.map((option, index) => (
          <option key={index} value={option} className={styles.option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
