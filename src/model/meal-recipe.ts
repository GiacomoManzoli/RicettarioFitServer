import {Recipe} from "./recipe";
export class MealRecipe {
    qty : number;
    recipe: Recipe;

    initWithJSON(json : any) : MealRecipe {
        this.recipe = new Recipe().initWithJSON(json.recipe);
        this.qty = json.qty;
        return this;
    }
}