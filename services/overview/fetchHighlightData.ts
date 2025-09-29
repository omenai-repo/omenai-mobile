import { fetchAllArtworksById } from 'services/artworks/fetchAllArtworksById';
import { fetchIncomeData } from 'services/overview/fetchIncomeData';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { getSalesHighlightData } from './getSalesHighlightData';

export async function fetchHighlightData(tag: string) {
  if (tag === 'artworks') {
    const result = await fetchAllArtworksById();
    return result?.isOk ? result.data?.length ?? 0 : 0;
  }
  if (tag === 'net') {
    const result = await fetchIncomeData('gallery');
    return result?.isOk && result.data.netIncome !== null
      ? utils_formatPrice(result.data.netIncome)
      : utils_formatPrice(0);
  }
  if (tag === 'revenue') {
    const result = await fetchIncomeData('gallery');
    return result?.isOk ? utils_formatPrice(result.data.salesRevenue) : utils_formatPrice(0);
  }

  if (tag === 'sales') {
    const result = await getSalesHighlightData();
    return result?.isOk ? result.data.length : 0;
  }
}
