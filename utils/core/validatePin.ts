export const validatePin = (pinArray: string[]) => {
  const pinStr = pinArray.join("");

  // Reject if all digits are the same
  if (new Set(pinStr).size === 1) {
    return false;
  }

  // Check for ascending or descending sequence
  const isAscending = pinStr
    .split("")
    .every(
      (digit, i, arr) =>
        i === 0 || Number.parseInt(digit) === Number.parseInt(arr[i - 1]) + 1
    );

  const isDescending = pinStr
    .split("")
    .every(
      (digit, i, arr) =>
        i === 0 || Number.parseInt(digit) === Number.parseInt(arr[i - 1]) - 1
    );

  if (isAscending || isDescending) {
    return false;
  }

  return true;
};
