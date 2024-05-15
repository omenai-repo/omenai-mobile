// export function splitArray(arr: any[], condition: any) {
//     const group1: any[] = [];
//     const group2: any[] = [];
    
//     arr.forEach((element) => {
//       if (condition(element)) {
//         group1.push(element);
//       } else {
//         group2.push(element);
//       }
//     });
  
//     return { group1, group2 };
// }
export function splitArray(arr: string | any[], splitIndex: number) {
    if (splitIndex < 0 || splitIndex >= arr.length) {
      throw new Error('Split index out of bounds');
    }
  
    const group1 = arr.slice(0, splitIndex);
    const group2 = arr.slice(splitIndex);
  
    return { group1, group2 };
  }