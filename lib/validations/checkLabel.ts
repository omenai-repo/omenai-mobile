export const checkLabel = (label: string) => {
  if (
    label === "admin" || 
    label === "location" || 
    label === "description" || 
    label === "address" || 
    label === "zipCode" || 
    label === "state" || 
    label === "city" || 
    label === "code"
  ) {
    return "general";
  } else return label;
};
