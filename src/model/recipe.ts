import {RecipeIngredient} from "./recipe-ingredient";
import {Ingredient} from "./ingredient";
export class Recipe {
    name : string;
    description : string;
    id : number;
    recipeIngredients : RecipeIngredient[];
    creator : number;


    constructor() {
        this.id = -1;
        this.name = "";
        this.description = "";
        this.recipeIngredients = [];
    }


    initWithJSON(x : any) : Recipe {
        this.id = x.id;
        this.name = x.name;
        this.description = x.description;
        x.recipeIngredients.forEach((ri) => {
            let ing = new Ingredient();
            ing.initWithJSON(ri.ingredient);
            let recipeIngredient = new RecipeIngredient(ing);
            recipeIngredient.qty = ri.qty;
            this.recipeIngredients.push(recipeIngredient);
        });

        return this;
    }


    get calories() {
        let cals = this.recipeIngredients.reduce(function (par, x) {
            return par + x.ingredient.calories/100 *x.qty;
        }, 0);
        return cals;
    }
    get carbs() {
        let val = this.recipeIngredients.reduce(function (par, x) {
            return par + x.ingredient.carbs/100 *x.qty;
        }, 0);
        return val;
    }
    get proteins() {
        return this.recipeIngredients.reduce(function (par, x) {
            return par + x.ingredient.proteins/100 *x.qty;
        }, 0)
    }
    get fats() {
        return this.recipeIngredients.reduce(function (par, x) {
            return par + x.ingredient.fats/100 *x.qty;
        }, 0)
    }
}