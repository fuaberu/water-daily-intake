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
