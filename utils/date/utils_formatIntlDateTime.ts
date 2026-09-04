export function formatIntlDateTime(inputDate: string | Date): string {
  const date = new Date(inputDate);

  // Extract day, month, and year
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();

  // Add the appropriate suffix to the day
  const dayWithSuffix = addSuffixToDay(day);

  // Extract hour and minute
  // Construct the final formatted date string
  const finalFormattedDate = `${dayWithSuffix} ${month}, ${year}`;

  //   at ${formattedHour}:${padZero(
  //     minute
  //   )

  return finalFormattedDate;
}

function addSuffixToDay(day: number): string {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}
