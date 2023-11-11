"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { FoodListObj } from "@/assets/FoodList";
import RecipeItemAdd from "@/Components/RecipeItemAdd/RecipeItemAdd";
import { InitialIngredientList } from "@/assets/InitialIngredientList";

export default function AddRecipe() {
  const [category, setCategory] = useState("Baby Food");
  const [ingredientCount, setIngredientCount] = useState<number>(1);
  const [ingredientList, setIngredientList] = useState<Array<FoodListObj>>(
    InitialIngredientList
  );
  // todo add component for ingredient. Each ingredient should have name, category, note
  //todo create an array to add all ingredients to
  //todo add a button that will push all info to RecipeList

  function writeUserData(e) {
    e.preventDefault();

    const database = getDatabase();
    set(ref(database, "FoodList/" + name), {
      Name: name,
      Category: e.target.value,
    }).catch((error) => {
      console.log("Uploaded Unsuccessfully... try again. ");
    });
  }

  function addAnotherIngredient(e) {
    e.preventDefault();
    const array = [...ingredientList];
    array.push({ name: "", category: "Baby Food", note: "" });
    setIngredientList(array);
  }

  return (
    <main className={styles.main}>
      <form action="" className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="name" className={styles.label}>
            Recipe Name:
          </label>
          <input type="text" name="name" id="name" className={styles.input} />
        </div>
        {ingredientList.map((ingred, index) => {
          return <RecipeItemAdd key={`ingredientListInit-${index}`} />;
        })}
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={addAnotherIngredient}>
            Add Another Ingredient
          </button>
          <button className={styles.button}>Submit Recipe</button>
        </div>
      </form>
    </main>
  );
}
