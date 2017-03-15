export class Ingredient {
    id : number = -1;
    name : string= "";
    calories : number= 0;
    caloriesWithFiber : number = 0;
    carbs : number = 0;
    fats : number= 0;
    proteins : number = 0;
    fibers : number = 0;
    official : boolean = false;
    user : number = -1;

    initWithJSON(json : any) : Ingredient {
        this.id = json["id"];
        this.name = json["name"];
        this.calories = json["calories"];
        this.caloriesWithFiber = json["caloriesWithFiber"];
        this.carbs = json["carbs"];
        this.proteins = json["proteins"];
        this.fats = json["fats"];
        this.fibers = json["fibers"];
        this.official = json["official"];
        this.user = json["user"];
        return this;
    }
}