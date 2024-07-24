import acrylic_art from 'assets/images/acrylic_art.jpg';
import charcoal_art from 'assets/images/charcoal_art.jpg';
import oil_art from 'assets/images/oil_art.jpg';
import photography_art from 'assets/images/photography_art.jpg';
import fabric_art from 'assets/images/fabric_art.jpg';

export const mediums = <CatalogCardTypes[]> [
    {name: 'Photography', value: 'Photography', image: photography_art},
    {name: 'Oil', value: 'Oil', image: oil_art},
    {name: 'Acrylic', value: 'Acrylic', image: acrylic_art},
    {name: 'Charcoal', value: 'Charcoal', image: charcoal_art},
    {name: 'Fabric', value: 'Fabric', image: fabric_art},
]