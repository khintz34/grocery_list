"use client";

import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { FoodListObj } from "@/assets/FoodList";
import { HeaderContext } from "@/contexts/authContext";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";
import MyListItem from "@/Components/MyListItem/MyListItem";

// todo make currentStore a dropdown and then refresh onChange with new path

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [shoppingOrder, setShoppingOrder] = useState<string>("Default");
  const [shoppingOrderArray, setShoppingOrderArray] = useState<Array<string>>(
    []
  );
  const [stores, setStores] = useState<Array<string>>([]);
  const [currentStore, setCurrentStore] = useState<string>(stores[0]);

  useEffect(() => {
    getStoreList();
    setHeaderText("My Grocery List");
  }, [setHeaderText]);

  async function getStoreList() {
    const Ref = databaseRef(db, `ShoppingOrderList/`);
    let storeArray: Array<string> = [];
    onValue(
      Ref,
      (snapshot) => {
        snapshot.forEach((childSnapShot) => {
          const childKey = childSnapShot.key;
          storeArray.push(childKey);
        });
        console.log("storeArray", storeArray);
        setStores(storeArray);
        setCurrentStore(storeArray[0]);
      },
      {
        onlyOnce: false,
      }
    );
  }

  useEffect(() => {
    setFoodList([]);
    getUserData();
  }, [refresh]);

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  function handleState(value: Array<FoodListObj>) {
    setFoodList([...value]);
  }

  async function getUserData() {
    getShoppingOrderList();
    const boardRef = databaseRef(db, "MyList/");
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
            note: childData.Note,
          };
          addData(obj);
        });
        sortFoodList(displayArray);
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: FoodListObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
    }

    function sortFoodList(list: Array<FoodListObj>) {
      list.sort(
        (a, b) =>
          shoppingOrderArray.indexOf(a.category) -
          shoppingOrderArray.indexOf(b.category)
      );
      setFoodList(list);
    }

    async function getShoppingOrderList() {
      const Ref = databaseRef(db, `ShoppingOrderList/${shoppingOrder}`);
      let displayArray: Array<string> = [];
      onValue(
        Ref,
        (snapshot) => {
          snapshot.forEach((childSnapShot) => {
            const childKey = childSnapShot.key;
            const childData = childSnapShot.val();
            displayArray.push(childData);
          });
          setShoppingOrderArray(displayArray);
        },
        {
          onlyOnce: false,
        }
      );
    }
  }

  return (
    <main className={styles.main}>
      <div>CURRENT STORE: {currentStore}</div>
      <div className={styles.listContainer}>
        {foodList?.map((val, index) => {
          if (index === 0) {
            return (
              <div
                key={`zero-${index}-${val.name}`}
                className={styles.foodItemContainer}
              >
                <div className={styles.catDisplay}>{val.category}</div>
                <MyListItem
                  key={`${val.name}-${index}`}
                  name={val.name}
                  category={val.category}
                  list={foodList}
                  removeItem={handleState}
                  note={val.note}
                  refresh={handleRefresh}
                  refVal={refresh}
                />
              </div>
            );
          } else {
            return val.category === foodList[index - 1].category ? (
              <MyListItem
                key={`${val.name}-${index}`}
                name={val.name}
                category={val.category}
                list={foodList}
                removeItem={handleState}
                note={val.note}
                refresh={handleRefresh}
                refVal={refresh}
              />
            ) : (
              <div
                key={`zero-${index}-${val.name}`}
                className={styles.foodItemContainer}
              >
                <div className={styles.catDisplay}>{val.category}</div>
                <MyListItem
                  key={`${val.name}-${index}`}
                  name={val.name}
                  category={val.category}
                  list={foodList}
                  removeItem={handleState}
                  note={val.note}
                  refresh={handleRefresh}
                  refVal={refresh}
                />
              </div>
            );
          }
        })}
      </div>
      <AddFoodContainer
        refresh={handleRefresh}
        refVal={refresh}
        path={true}
        reset={handleState}
        foodlistProp={foodList}
      />
    </main>
  );
}
