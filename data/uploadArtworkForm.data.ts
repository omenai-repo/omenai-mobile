import { countries } from './countryList';

export type selectItemProp = { label: string; value: string };

export const preferredShippingCarrier: selectItemProp[] = [
  { label: 'UPS', value: 'ups' },
  { label: 'DHL', value: 'dhl' },
  { label: 'FedEx', value: 'fed-ex' },
  { label: 'Maersk', value: 'Maersk' },
];

export const displayPrice: selectItemProp[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

export const framingList: selectItemProp[] = [
  { label: 'Framed', value: 'Framed' },
  { label: 'Not framed', value: 'Not framed' },
];

export const rarityList: selectItemProp[] = [
  { label: 'Unique', value: 'Unique' },
  { label: 'Limited edition', value: 'Limited edition' },
  { label: 'Open edition', value: 'Open edition' },
  { label: 'Unknown edition', value: 'Unknown edition' },
];

export const certificateOfAuthenticitySelectOptions: selectItemProp[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

export const signatureSelectOptions: selectItemProp[] = [
  { label: 'By artist', value: 'By artist' },
  { label: 'By gallery', value: 'By gallery' },
  { label: 'No signature', value: 'no signature' },
];

export const signatureArtistSelectOptions: selectItemProp[] = [
  { label: 'By artist', value: 'By artist' },
  { label: 'No signature', value: 'no signature' },
];

export const countriesListing: selectItemProp[] = countries.map((country) => ({
  label: country,
  value: country,
}));

export const mediumListing: selectItemProp[] = [
  { label: 'Mixed media on paper/canvas', value: 'Mixed media on paper/canvas' },
  { label: 'Works on paper', value: 'Works on paper' },
  {
    label: 'Sculpture (Resin/plaster/clay)',
    value: 'Sculpture (Resin/plaster/clay)',
  },
  { label: 'Oil on canvas/panel', value: 'Oil on canvas/panel' },
  { label: 'Canvas', value: 'Canvas' },
  { label: 'Photography', value: 'Photography' },
  {
    label: 'Acrylic on canvas/linen/panel',
    value: 'Acrylic on canvas/linen/panel',
  },
  {
    label: 'Sculpture (Bronze/stone/metal)',
    value: 'Sculpture (Bronze/stone/metal)',
  },
];
