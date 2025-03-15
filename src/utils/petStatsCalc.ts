import {
  getNutritionFromId,
  getRecipesEatenPastDay,
} from "../models/recipeModel.js";
import { getAllUserData, updateUserPetPoints } from "../models/userModel.js";
import { getSupabaseAdminClient } from "./supabase.js";

export const petStatsCalc = async () => {
  // this point helper function decides how many points user will receive based on how close ratio is to one
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

  // gets current day and past day span to find recipes eaten in that timeframe
  const currentDay = new Date();
  const pastDay = new Date(currentDay);
  pastDay.setDate(pastDay.getDate() - 1);
  const currentDayToISO = currentDay.toISOString();
  const pastDayToISO = pastDay.toISOString();

  // create supabase admin client and grabs all user data
  const newSupabase = await getSupabaseAdminClient();
  const userData = await getAllUserData(newSupabase);

  // for each user, this loop will go through and update their pet stats
  for (let user of userData) {
    // first, get all the user_recipe records that have been eaten in the past day
    const recipesEatenPastDay = await getRecipesForPetCalc(
      user.id,
      newSupabase,
      pastDayToISO,
      currentDayToISO
    );

    // now, get the nutrition info using those user_recipe records from recipe table
    const nutritionArr = [];
    for (let recipe of recipesEatenPastDay) {
      let [{ nutrition }] = await getNutritionFromId(
        recipe.recipe_id,
        newSupabase
      );
      nutritionArr.push(nutrition);
    }

    // create total and average variables to get the daily eaten macro stats
    let totalCalories: number = 0;
    let averageFatPercent: number = 0;
    let averageCarbsPercent: number = 0;
    let averageProteinPercent: number = 0;

    // loop through nutrition arr and add each individual recipes macros
    for (let nutrition of nutritionArr) {
      totalCalories += nutrition.calories;
      averageFatPercent += nutrition.macronutrients.fat.percentage;
      averageCarbsPercent += nutrition.macronutrients.carbs.percentage;
      averageProteinPercent += nutrition.macronutrients.protein.percentage;
    }

    // for the averages, divide the sum by arr length to create the average
    averageFatPercent = averageFatPercent / nutritionArr.length;
    averageCarbsPercent = averageCarbsPercent / nutritionArr.length;
    averageProteinPercent = averageProteinPercent / nutritionArr.length;

    // calculate the ratio of eaten macros vs goal macros. The closer the ratio is to 1, the closer the user got to their goal
    let calorieRatio = totalCalories / user.daily_calorie_goal;
    let fatRatio = averageFatPercent / user.daily_fat_goal;
    let carbsRatio = averageCarbsPercent / user.daily_carb_goal;
    let proteinRatio = averageProteinPercent / user.daily_protein_goal;

    // if ratio is above 1, inverse it so that the ratio is a percent
    if (calorieRatio > 1) calorieRatio = 1 / calorieRatio;
    if (fatRatio > 1) fatRatio = 1 / fatRatio;
    if (carbsRatio > 1) carbsRatio = 1 / carbsRatio;
    if (proteinRatio > 1) proteinRatio = 1 / proteinRatio;

    // these points will be what is used to update the stats. By default, set them equal to their original value in the db
    let caloriePoints = user.pet_daily_calorie_happiness;
    let fatPoints = user.pet_daily_fat_happiness;
    let carbsPoints = user.pet_daily_carb_happiness;
    let proteinPoints = user.pet_daily_protein_happiness;

    // check if the stats are in the required range of 0 to 100. If they are, do the point helper calc to see how much they gain or lose
    if (
      user.pet_daily_calorie_happiness >= 0 &&
      user.pet_daily_calorie_happiness <= 100
    ) {
      caloriePoints =
        user.pet_daily_calorie_happiness + pointHelper(calorieRatio);
    }

    if (
      user.pet_daily_fat_happiness >= 0 &&
      user.pet_daily_fat_happiness <= 100
    ) {
      fatPoints = user.pet_daily_fat_happiness + pointHelper(fatRatio);
    }

    if (
      user.pet_daily_carb_happiness >= 0 &&
      user.pet_daily_carb_happiness <= 100
    ) {
      carbsPoints = user.pet_daily_carb_happiness + pointHelper(carbsRatio);
    }

    if (
      user.pet_daily_protein_happiness >= 0 &&
      user.pet_daily_protein_happiness <= 100
    ) {
      proteinPoints = user.pet_daily_carb_happiness + pointHelper(proteinRatio);
    }

    // finally, add the new stats for the users pet
    const updatePointsStatus = await updateUserPetPoints(
      user.id,
      caloriePoints,
      fatPoints,
      carbsPoints,
      proteinPoints,
      newSupabase
    );
  }
};
