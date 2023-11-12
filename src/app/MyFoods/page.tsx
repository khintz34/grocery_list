"use client";

import styles from "./page.module.scss";
import { ref as databaseRef, onValue, ref } from "firebase/database";
import { db } from "../../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { FoodListObj } from "@/assets/FoodList";
import Dropdown from "../../assets/Dropdown/Dropdown";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";
import { HeaderContext } from "@/contexts/authContext";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { headerText, setHeaderText } = useContext(HeaderContext);

  // todo add AddFoodContainer
  //todo pass in fxn to add to MyList as well

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, [refresh]);

  useEffect(() => {
    setHeaderText("My Foods");
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
          let obj = {
            name: childData.Name,
            category: childData.Category,
            note: "",
          };
          addData(obj);
        });
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: FoodListObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
    }
  }

  function handleState(value: Array<FoodListObj>) {
    console.log("state: myFods");
    setFoodList([...value]);
  }

  function handleRefresh(value: boolean) {
    console.log("refreshing myFoods");
    setRefresh(value);
  }

  return (
    <main className={styles.main}>
      {foodList?.map((val, index) => {
        return (
          <div
            key={`${val}-${index}`}
            className={styles.foodContainer}
            onChange={() => console.log("changed")}
          >
            <div className={styles.foodName}>{val.name}</div>
            <Dropdown
              firstOpt={val.category}
              name={val.name}
              add={() => setFoodList([...foodList])}
              list={foodList}
              removeItem={handleState}
            />
          </div>
        );
      })}
      <AddFoodContainer
        refresh={handleRefresh}
        refVal={refresh}
        path={false}
        reset={() => console.log("reset")}
        foodlistProp={[]}
      />
    </main>
  );
}
