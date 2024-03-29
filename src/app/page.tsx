"use client";

import styles from "./page.module.scss";
import { ref as databaseRef, onValue } from "firebase/database";
import { db } from "../assets/firebase";
import { useState, useEffect, useContext } from "react";
import { FoodListObj } from "@/assets/FoodList";
import { HeaderContext, UsernameContext } from "@/contexts/authContext";
import AddFoodContainer from "@/Components/AddFoodContainer/AddFoodContainer";
import MyListItem from "@/Components/MyListItem/MyListItem";
import { StoreDropdown } from "@/Components/StoreDropdown/StoreDropdown";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthContext } from "@/contexts/authContext";

export default function Home() {
  const [foodList, setFoodList] = useState<Array<FoodListObj>>();
  const { headerText, setHeaderText } = useContext(HeaderContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [shoppingOrder, setShoppingOrder] = useState<string>("ALDI");
  const [shoppingOrderArray, setShoppingOrderArray] = useState<Array<string>>(
    []
  );
  const [stores, setStores] = useState<Array<string>>([]);
  const [currentStore, setCurrentStore] = useState<string>("ALDI");

  // AUTH STUFF
  const { auth, setAuth } = useContext(AuthContext);
  const { username, setUsername } = useContext(UsernameContext);

  useEffect(() => {
    console.log(username);
    console.log(auth);
  });

  useEffect(() => {
    getStoreList();
    setHeaderText("Grocery Mate");
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
    getUserData(currentStore);
  }, [refresh]);

  function handleRefresh(value: boolean) {
    setRefresh(value);
  }

  function handleState(value: Array<FoodListObj>) {
    setFoodList([...value]);
  }

  async function getUserData(passedStore: String) {
    let shoppingOrderListTemp = getShoppingOrderList(passedStore);
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
        sortFoodList(displayArray, shoppingOrderListTemp);
      },
      {
        onlyOnce: false,
      }
    );

    function addData(obj: FoodListObj) {
      displayArray.push(obj);
      setFoodList([...displayArray]);
    }

    function sortFoodList(list: Array<FoodListObj>, catList: Array<string>) {
      list.sort(
        (a, b) => catList.indexOf(a.category) - catList.indexOf(b.category)
      );
      setFoodList(list);
    }
  }

  function getShoppingOrderList(passedStore: String) {
    const Ref = databaseRef(db, `ShoppingOrderList/${passedStore}`);
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
    return displayArray;
  }

  function changeCurrentStore(value: string) {
    setCurrentStore(value);
    setShoppingOrder(value);
    getUserData(value);
  }

  return (
    <main className={styles.main}>
      <div className={styles.listContainer}>
        <div className={styles.currentStoreDiv}>
          CURRENT STORE:
          <StoreDropdown
            storeArray={stores}
            changeCurrentStore={changeCurrentStore}
          />
        </div>
        {foodList?.map((val, index) => {
          if (index === 0) {
            return (
              <div key={`zero-${index}-${val.name}`}>
                <div className={styles.catDisplay}>{val.category}</div>
                <div
                  className={`${styles.foodItemContainer} ${styles.marginLeft10}`}
                >
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
              <div key={`zero-${index}-${val.name}`}>
                <div className={styles.catDisplay}>{val.category}</div>
                <div
                  className={`${styles.foodItemContainer} ${styles.marginLeft10}`}
                >
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
