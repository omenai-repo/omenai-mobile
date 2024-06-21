export const salesDataAlgorithm = (salesData: any) => {
  const groupedData = salesData.reduce(
    (accumulator: any, currentValue: any) => {
      const { month, value } = currentValue;
      accumulator[month] = (accumulator[month] || 0) + value;
      return accumulator;
    },
    {}
  );

  const monthlySalesData = monthsOrder.map((month) => {
    const revenue = groupedData[month] || 0;
    return {
      name: month,
      Revenue: revenue,
    };
  });

  return monthlySalesData;
};

export const getSalesDataHighestMonth = (salesData: {Revenue: any, name: string}[]) => {
  let highest = 0
  salesData.map((month, _) => {

    if(month.Revenue >= highest){
      highest = month.Revenue
    }
    
  });

  return highest
}

export const splitNumberIntoChartIndicator = (number: number) => {
  let snapshots = [];
  let currentNumber = number;

  for (let i = 0; i < 6; i++) {
    snapshots.push(currentNumber);
    currentNumber = Math.floor(currentNumber / 2);
  }

  return snapshots;
}

const monthsOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
