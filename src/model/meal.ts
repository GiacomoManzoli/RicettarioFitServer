import {MealRecipe} from "./meal-recipe";
import {MealIngredient} from "./meal-ingredient";

export class Meal {
    id: number;
    tags: string[];
    description: string;
    creator: number;
    name : string;

    mealRecipes: MealRecipe[];
    mealIngredients: MealIngredient[];

    constructor() {
        this.tags = [];
        this.mealIngredients = [];
        this.mealRecipes = [];
    }

    initWithJSON(x: any): Meal {
        this.id = x.id;
        this.tags = x.tags;
        this.description = x.description;
        this.creator = x.creator;
        this.name = x.name;


        x.mealRecipes.forEach((mr) => {
            let o = new MealRecipe().initWithJSON(mr);
            this.mealRecipes.push(o);
        });

        x.mealIngredients.forEach((mi) => {
            let o = new MealIngredient().initWithJSON(mi);
            this.mealIngredients.push(o);
        });

        return this;
    }

    get calories() {
        let val = this.mealIngredients.reduce(function (par, x) {
            return par + x.ingredient.calories/100 *x.qty;
        }, 0);
        val = this.mealRecipes.reduce(function (par, x) {
            return par + x.recipe.calories *x.qty;
        }, val);
        return val;
    }
    get carbs() {
        let val = this.mealIngredients.reduce(function (par, x) {
            return par + x.ingredient.carbs/100 *x.qty;
        }, 0);
        val = this.mealRecipes.reduce(function (par, x) {
            return par + x.recipe.carbs *x.qty;
        }, val);
        return val;
    }
    get proteins() {
        let val = this.mealIngredients.reduce(function (par, x) {
            return par + x.ingredient.proteins/100 *x.qty;
        }, 0);
        val = this.mealRecipes.reduce(function (par, x) {
            return par + x.recipe.proteins *x.qty;
        }, val);
        return val;
    }
    get fats() {
        let val = this.mealIngredients.reduce(function (par, x) {
            return par + x.ingredient.fats/100 *x.qty;
        }, 0);
        val = this.mealRecipes.reduce(function (par, x) {
            return par + x.recipe.fats *x.qty;
        }, val);
        return val;
    }
}