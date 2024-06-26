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
]