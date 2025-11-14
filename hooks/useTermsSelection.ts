export function useTermsSelection() {
  const handleToggleTerm = (
    index: number,
    selectedTerms: number[],
    setSelectedTerms: (terms: number[]) => void
  ) => {
    if (selectedTerms.includes(index)) {
      setSelectedTerms(selectedTerms.filter((term) => term !== index));
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };

  return { handleToggleTerm };
}
