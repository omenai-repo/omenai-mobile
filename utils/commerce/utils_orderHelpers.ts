// Check if an artwork is still within its 90 days exclusivity period
export const isArtworkExclusiveDate = (createdAt: string | Date): boolean => {
  const created = new Date(createdAt).getTime();
  const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 90;
};
