import { fetchIncomeData } from 'services/overview/fetchIncomeData';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { getSalesHighlightData } from './getSalesHighlightData';
import { getWalletBalance } from './getWalletBalance';
import { getArtworkHighlightData } from './getArtworkHighlightData';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

export async function fetchArtistHighlightData(tag: string) {
  let userId = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }
  if (tag === 'net') {
    const result = await fetchIncomeData('artist');
    return result?.isOk ? utils_formatPrice(result.data.netIncome) : utils_formatPrice(0);
  }
  if (tag === 'revenue') {
    const result = await fetchIncomeData('artist');
    return result?.isOk ? utils_formatPrice(result.data.salesRevenue) : utils_formatPrice(0);
  }

  if (tag === 'balance') {
    const result = await getWalletBalance({ id: userId });
    return result ? utils_formatPrice(result.balances.available) : utils_formatPrice(0);
  }

  if (tag === 'artworks') {
    const result = await getArtworkHighlightData({ sessionId: userId });
    console.log(result);
    return result?.isOk ? result.data.length : 0;
  }

  if (tag === 'sales') {
    const result = await getSalesHighlightData();
    return result?.isOk ? result.data.length : 0;
  }
}
