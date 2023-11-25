"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.scss";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { db } from "../../assets/firebase";
import { FoodListObj } from "@/assets/FoodList";
import RecipeItemAdd from "@/Components/RecipeItemAdd/RecipeItemAdd";
import { InitialIngredientList } from "@/assets/InitialIngredientList";

export default function AddRecipe() {
  //! todo fix this.
  //! needs a copy of init array that is blank
  const copyInitArray = JSON.parse(JSON.stringify(InitialIngredientList));
  function createCopy() {
    return JSON.parse(JSON.stringify(InitialIngredientList));
  }
  const [ingredientList, setIngredientList] =
    useState<Array<FoodListObj>>(copyInitArray);

  const [recipeName, setRecipeName] = useState<string>("");
  const refer = useRef<any>();
  const [addedEls, SetAddedEls] = useState<number>(0);

  function writeUserData(e: React.ChangeEvent<any>) {
    e.preventDefault();

    if (recipeName !== "") {
      ingredientList.forEach((ingredient: FoodListObj, index) => {
        if (ingredient.name !== "") {
          writeIngredient(ingredient);
        }
      });
      alert(recipeName + " added to Recipes!");
      setRecipeName("");
      setIngredientList(createCopy());
    } else {
      alert("Enter a recipe name to add to recipe list");
    }

    function writeIngredient(ingredient: FoodListObj) {
      set(ref(db, "RecipeList/" + recipeName + "/" + ingredient.name), {
        Name: ingredient.name,
        Category: ingredient.category,
        Note: ingredient.note,
      }).catch((error) => {
        console.log("Uploaded Unsuccessfully... try again. ");
      });
    }
  }

  useEffect(() => {
    if (addedEls > 0) {
      const lastChildElement = refer.current?.lastElementChild;
      lastChildElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [addedEls]);

  function addAnotherIngredient(e: React.ChangeEvent<any>) {
    e.preventDefault();
    const array = [...ingredientList];
    array.push({ name: "", category: "Baby Food", note: "" });
    setIngredientList(array);
    let newEl = addedEls + 1;
    SetAddedEls(newEl);
  }

  function handleUpdate(
    index: number,
    name: string,
    category: string,
    note: string
  ) {
    const newArray = [...ingredientList];
    newArray[index].name = name;
    newArray[index].category = category;
    newArray[index].note = note;

    setIngredientList(newArray);
  }

  return (
    <main className={styles.main}>
      <form action="" className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="name" className={styles.label}>
            Recipe Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className={styles.input}
            onChange={(e) => setRecipeName(e.target.value)}
            value={recipeName}
          />
        </div>
        <div ref={refer}>
          {ingredientList.map((ingred, index) => {
            return (
              <RecipeItemAdd
                key={`ingredientListInit-${index}`}
                num={index}
                onChange={handleUpdate}
                inputName={ingred.name}
                inputCat={ingred.category}
                inputNote={ingred.note}
              />
            );
          })}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={addAnotherIngredient}>
            Add Another Ingredient
          </button>
          <button className={styles.button} onClick={(e) => writeUserData(e)}>
            Submit Recipe
          </button>
        </div>
      </form>
    </main>
  );
}
