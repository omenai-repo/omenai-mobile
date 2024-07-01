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

export function organizeOrders(arr: any[]){
  const pendingOrders = [];
  const processingOrders = [];
  const completedOrders = [];

  for(let i = 0; i < arr.length; i++){
    const order = arr[i];

    //first check for orders that has order accepted status set to empty
    if(order.order_accepted.status === ""){
      pendingOrders.push(order)
    }else if(order.order_accepted.status === "declined"){ //Then orders accepted status set to decline should move to completed
      completedOrders.push(order)
    }else{ //anything in-between must def be in processing
      processingOrders.push(order)
    }
  };

  const organizedOrders = {
    pending: pendingOrders,
    processing: processingOrders,
    completed: completedOrders
  }

  return organizedOrders
}