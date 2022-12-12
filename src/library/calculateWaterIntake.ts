import { IUnit } from "../pages";

export const calculateWater = ({
  weight,
  height,
  gender,
  age,
  active,
}: {
  weight: number;
  height: number;
  gender: "male" | "female";
  age: number;
  active: "lightly-active" | "moderately-active" | "very-active" | "no-active";
  unit: IUnit;
}) => {
  let BMI = (weight / height / height) * 10000;

  BMI = Math.round(BMI);

  let baseAI = 0; // Base daily intake
  if (BMI <= 25) {
    if (age < 1) {
      baseAI = 800;
    } else if (age >= 1 && age <= 3) {
      baseAI = 1300;
    } else if (age >= 4 && age <= 8) {
      baseAI = 1700;
    } else {
      if (gender === "male") {
        // Male
        if (age >= 9 && age <= 13) {
          // Children
          baseAI = 2400;
        } else if (age >= 14 && age <= 18) {
          // Teen
          baseAI = 3300;
        } else {
          // Adult
          baseAI = 3700;
        }
      } else {
        // Female
        if (age >= 9 && age <= 13) {
          // Children
          baseAI = 2100;
        } else if (age >= 14 && age <= 18) {
          // Teen
          baseAI = 2300;
        } else {
          // Adult
          baseAI = 2700;
        }
      }
    }
  } else {
    baseAI = ((2.20462 * weight * 2) / 3) * 29.5735;
    // baseAI /= 1e3; // To liters
  }
  if (active === "lightly-active") {
    baseAI += (5 * baseAI) / 100;
  } else if (active === "moderately-active") {
    baseAI += (10 * baseAI) / 100;
  } else if (active === "very-active") {
    baseAI += (20 * baseAI) / 100;
  }
  return baseAI * 0.81; //  Water and other beverages represent approximately 81% of total water intake
};
