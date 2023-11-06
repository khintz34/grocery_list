import { FoodListObj } from "./FoodList";

export interface RecipeObj {
  recipeName: string;
  ingredientList: Array<FoodListObj>;
}
