"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { CategoryList } from "../../assets/CategoryList";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { db } from "../../assets/firebase";
import { FoodListObj } from "@/assets/FoodList";
import RecipeItemAdd from "@/Components/RecipeItemAdd/RecipeItemAdd";
import { InitialIngredientList } from "@/assets/InitialIngredientList";

export default function AddRecipe() {
  const [category, setCategory] = useState("Baby Food");
  const [ingredientCount, setIngredientCount] = useState<number>(1);
  const [ingredientList, setIngredientList] = useState<Array<FoodListObj>>(
    InitialIngredientList
  );
  const [recipeName, setRecipeName] = useState<string>("");
  // todo add component for ingredient. Each ingredient should have name, category, note
  //todo create an array to add all ingredients to
  //todo add a button that will push all info to RecipeList
  // todo add vaidation for each ingredient

  function writeUserData(e: React.ChangeEvent<any>) {
    e.preventDefault();

    // ! fix this to add to recipe list onSubmit
    if (recipeName !== "") {
      ingredientList.forEach((ingredient: FoodListObj, index) => {
        if (ingredient.name !== "") {
          writeIngredient(ingredient);
          console.log(ingredient);
        }
      });
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

  function addAnotherIngredient(e: React.ChangeEvent<any>) {
    e.preventDefault();
    const array = [...ingredientList];
    array.push({ name: "", category: "Baby Food", note: "" });
    setIngredientList(array);
  }

  //   function handleSubmit(e) {
  //     e.preventDefault();
  //     console.log(ingredientList);
  //   }

  function handleUpdate(
    index: number,
    name: string,
    category: string,
    note: string
  ) {
    console.log(index, name, category, note);
    const newArray = [...ingredientList];
    console.log(newArray);
    newArray[index].name = name;
    newArray[index].category = category;
    newArray[index].note = note;
    console.log(newArray[index]);

    setIngredientList(newArray);

    // console.log(ingredientList[index]);
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
          />
        </div>
        {ingredientList.map((ingred, index) => {
          return (
            <RecipeItemAdd
              key={`ingredientListInit-${index}`}
              num={index}
              onChange={handleUpdate}
            />
          );
        })}
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
