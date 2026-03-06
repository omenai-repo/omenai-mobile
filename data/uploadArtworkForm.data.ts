import { countries } from "./countryList";

export type selectItemProp = { label: string; value: string };

export const preferredShippingCarrier: selectItemProp[] = [
  { label: "UPS", value: "ups" },
  { label: "DHL", value: "dhl" },
  { label: "FedEx", value: "fed-ex" },
  { label: "Maersk", value: "Maersk" },
];

export const displayPrice: selectItemProp[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const framingList: selectItemProp[] = [
  { label: "Framed", value: "Framed" },
  { label: "Not framed", value: "Not framed" },
];

export const rarityList: selectItemProp[] = [
  { label: "Unique", value: "Unique" },
];

export const certificateOfAuthenticitySelectOptions: selectItemProp[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const signatureSelectOptions: selectItemProp[] = [
  { label: "By artist", value: "By artist" },
  { label: "By gallery", value: "By gallery" },
  { label: "No signature", value: "no signature" },
];

export const signatureArtistSelectOptions: selectItemProp[] = [
  { label: "By artist", value: "By artist" },
  { label: "No signature", value: "no signature" },
];

export const countriesListing: selectItemProp[] = countries.map((country) => ({
  label: country,
  value: country,
}));

export const mediumListing: selectItemProp[] = [
  { label: "Photography", value: "Photography" },
  { label: "Works on paper", value: "Works on paper" },
  {
    label: "Acrylic on canvas/linen/panel",
    value: "Acrylic on canvas/linen/panel",
  },
  {
    label: "Mixed media on canvas/paper",
    value: "Mixed media on canvas/paper",
  },
  { label: "Oil on canvas/panel", value: "Oil on canvas/panel" },
];
