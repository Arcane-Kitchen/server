import {
  getNutritionFromId,
  getRecipesForPetCalc,
} from "../models/recipeModel.js";
import { getAllUserData, updateUserPetPoints } from "../models/userModel.js";
import { getSupabaseAdminClient } from "./supabase.js";

export const petStatsCalc = async () => {
  const pointHelper = (ratio: number) => {
    if (ratio > 0.9) {
      return 3;
    }
    if (ratio > 0.8) {
      return 2;
    }
    if (ratio > 0.7) {
      return 1;
    }
    if (ratio > 0.6) {
      return 0;
    }
    return -1;
  };

  const currentDay = new Date();
  const pastDay = new Date(currentDay);
  pastDay.setDate(pastDay.getDate() - 1);

  const currentDayToISO = currentDay.toISOString();
  const pastDayToISO = pastDay.toISOString();

  const newSupabase = await getSupabaseAdminClient();
  const userData = await getAllUserData(newSupabase);

  for (let user of userData) {
    const recipesEatenPastDay = await getRecipesForPetCalc(
      user.id,
      newSupabase,
      pastDayToISO,
      currentDayToISO
    );
    // console.log(recipesEatenPastDay);
    const nutritionArr = [];

    for (let recipe of recipesEatenPastDay) {
      let [{ nutrition }] = await getNutritionFromId(
        recipe.recipe_id,
        newSupabase
      );
      nutritionArr.push(nutrition);
    }
    // console.log(nutritionArr);
    let totalCalories: number = 0;
    let averageFatPercent: number = 0;
    let averageCarbsPercent: number = 0;
    let averageProteinPercent: number = 0;

    for (let nutrition of nutritionArr) {
      totalCalories += nutrition.calories;
      averageFatPercent += nutrition.macronutrients.fat.percentage;
      averageCarbsPercent += nutrition.macronutrients.carbs.percentage;
      averageProteinPercent += nutrition.macronutrients.protein.percentage;
    }
    averageFatPercent = averageFatPercent / nutritionArr.length;
    averageCarbsPercent = averageCarbsPercent / nutritionArr.length;
    averageProteinPercent = averageProteinPercent / nutritionArr.length;

    // if (nutritionArr.length !== 0) {
    //   console.log(averageCarbsPercent);
    // }
    let calorieRatio = totalCalories / user.daily_calorie_goal;
    let fatRatio = averageFatPercent / user.daily_fat_goal;
    let carbsRatio = averageCarbsPercent / user.daily_carb_goal;
    let proteinRatio = averageProteinPercent / user.daily_protein_goal;

    if (calorieRatio > 1) calorieRatio = 1 / calorieRatio;
    if (fatRatio > 1) fatRatio = 1 / fatRatio;
    if (carbsRatio > 1) carbsRatio = 1 / carbsRatio;
    if (proteinRatio > 1) proteinRatio = 1 / proteinRatio;

    if (user.pet_daily_calorie_happiness > 0) {
    }

    let caloriePoints =
      user.pet_daily_calorie_happiness + pointHelper(calorieRatio);
    let fatPoints = user.pet_daily_fat_happiness + pointHelper(fatRatio);
    let carbsPoints = user.pet_daily_carb_happiness + pointHelper(carbsRatio);
    let proteinPoints =
      user.pet_daily_protein_happiness + pointHelper(proteinRatio);

    const updatePoints = await updateUserPetPoints(
      12,
      caloriePoints,
      fatPoints,
      carbsPoints,
      proteinPoints,
      newSupabase
    );
    console.log(updatePoints);
  }

  // const [{ nutrition }] = await getNutritionFromId(10, newSupabase);
  // console.log(nutritionArr);

  // console.log(userData);
  // console.log(pastDay);
};
