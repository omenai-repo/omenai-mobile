import { ordersColorsTypes } from 'components/gallery/OrderCard';

export const utils_getColors = (selectedTab: string, order?: any): ordersColorsTypes => {
  if (selectedTab === 'processing' && order?.payment_information.status === 'completed') {
    return { bgColor: '#17963925', textColor: '#000' };
  }
  if (selectedTab === 'completed' && order?.order_accepted.status === 'accepted') {
    return { bgColor: '#17963925', textColor: '#000' };
  }
  if (selectedTab === 'completed') {
    return { bgColor: '#ff000020', textColor: '#ff0000' };
  }

  return { bgColor: '#FFBF0030', textColor: '#000' };
};

export function utils_getInitials(fullName: string): string {
  if (!fullName.trim()) return ''; // Trim spaces and check for empty input

  const names = fullName.trim().split(/\s+/); // Split by multiple spaces
  const initials = names.map((name) => name[0].toUpperCase()).join('');

  return initials;
}
