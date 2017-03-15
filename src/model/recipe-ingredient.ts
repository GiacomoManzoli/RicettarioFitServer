import {Ingredient} from "./ingredient";
export class RecipeIngredient {
    qty : number;
    ingredient: Ingredient;

    constructor(ingredient : Ingredient) {
        this.ingredient = ingredient;
        this.qty = 100;
    }
}