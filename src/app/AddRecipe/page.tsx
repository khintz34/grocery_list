"use client";
import React from "react";
import styles from "./page.module.scss";

export default function AddRecipe() {
  return (
    <main className={styles.main}>
      <form action="">
        <div>
          <label htmlFor="name">Recipe Name</label>
          <input type="text" name="name" id="name" />
        </div>
      </form>
    </main>
  );
}
