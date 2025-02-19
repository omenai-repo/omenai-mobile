import { countries } from "./countryList";

export type selectItemProp = {label: string, value: string}

export const preferredShippingCarrier : selectItemProp[] = [
    {label: 'UPS', value: 'ups'},
    {label: 'DHL', value: 'dhl'},
    {label: 'FedEx', value: 'fed-ex'},
    {label: 'Maersk', value: 'Maersk'},
];

export const displayPrice : selectItemProp[] = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'}
];

export const framingList : selectItemProp[] = [
    {label: 'Framed', value: 'Framed'},
    {label: 'Not framed', value: 'Not framed'}
];

export const rarityList : selectItemProp[] = [
    {label: 'Unique', value: 'Unique'},
    {label: 'Limited edition', value: 'Limited edition'},
    {label: 'Open edition', value: 'Open edition'},
    {label: 'Unknown edition', value: 'Unknown edition'}
];

export const certificateOfAuthenticitySelectOptions : selectItemProp[] = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'}
];

export const signatureSelectOptions : selectItemProp[] = [
    {label: 'By artist', value: 'By artist'},
    {label: 'By gallery', value: 'By gallery'},
    {label: 'No signature', value: 'no signature'}
];

export const countriesListing: selectItemProp[] = countries.map(country => ({
    label: country,
    value: country
}));

export const mediumListing: selectItemProp[] = [
    {label: 'Oil', value: 'Oil'},
    {label: 'Acrylic', value: 'Acrylic'},
    {label: 'Mixed media', value: 'Mixed media'},
    {label: 'Paper', value: 'Paper'},
    {label: 'Ink', value: 'Ink'},
    {label: 'Canvas', value: 'Canvas'},
    {label: 'Photography', value: 'Photography'},
    {label: 'Ankara', value: 'Ankara'},
    {label: 'Charcoal', value: 'Charcoal'},
    {label: 'Fabric', value: 'Fabric'},
    {label: 'Collage or other works on paper', value: 'Collage or other works on paper'},
    {label: 'Other', value: 'Other'},
]

export const artistStyle: selectItemProp[] = [
    {label: 'Art Form', value: 'Art Form'},
    {label: 'Live arts', value: 'Live arts'},
    {label: 'Wall arts', value: 'Wall arts'},
    {label: 'Gallery', value: 'Gallery'},
    {label: 'Sculptures', value: 'Sculptures'},
    {label: 'Classisism', value: 'Classisism'},
    {label: 'Photography', value: 'Photography'},
    {label: 'Surrealism', value: 'Surrealism'},
    {label: 'Paintings', value: 'Paintings'},
    {label: 'Tarpestry', value: 'Tarpestry'},
]