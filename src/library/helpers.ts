import { IExercise } from "../pages";

export function decimalToFraction(num: number) {
  let numsAfterDecPoint = num.toString().split(".")[1]
    ? num.toString().split(".")[1].length
    : 0;

  let numerator = num * Math.pow(10, numsAfterDecPoint);
  let denominator = Math.pow(10, numsAfterDecPoint);

  let d = GCD(numerator, denominator);

  return numerator / d + "/" + denominator / d;
}

function GCD(a: number, b: number) {
  let r = 0;

  while (b != 0) {
    r = a % b;
    a = b;
    b = r;
  }

  return a;
}

export const convertActiveNames = (string: IExercise) => {
  switch (string) {
    case "no-active":
      return "Sedentary";
    case "lightly-active":
      return "Lightly active";
    case "moderately-active":
      return "Moderatly active";
    case "very-active":
      return "Very active";

    default:
      return "Sedentary";
  }
};
