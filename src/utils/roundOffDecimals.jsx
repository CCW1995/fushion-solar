import { thousandSeparatorFormatter } from "./thousandSeparator";

export function roundToNearestTenth(amount) {
  // Multiply by 10, round to the nearest integer, then divide by 10
  let roundedAmount = Math.round(amount * 10) / 10;

  // Check the difference between the original and the rounded value
  let difference = roundedAmount - amount;

  // If the difference is exactly 0.05, round up to the nearest 0.10
  if (difference === 0.05) {
    roundedAmount += 0.05;
  }

  // Convert to a fixed decimal string and back to number to ensure two decimal places
  return parseFloat(roundedAmount.toFixed(2));
}

export function displayRoundValue(initialValue, finalValue) {
  const difference = Number(finalValue || 0) - Number(initialValue || 0);

  if (difference === 0) {
    return "0.00";
  }

  const sign = difference.toFixed(2) < 0 ? '-' : '';
  return sign + thousandSeparatorFormatter(Math.abs(difference));
}
