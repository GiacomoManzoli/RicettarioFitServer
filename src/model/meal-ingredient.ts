import {Ingredient} from "./ingredient";
export class MealIngredient {
    qty : number;
    ingredient: Ingredient;


    initWithJSON(json : any) : MealIngredient {
        this.ingredient = new Ingredient().initWithJSON(json.ingredient);
        this.qty = json.qty;
        return this;
    }
}