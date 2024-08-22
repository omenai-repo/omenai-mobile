import acrylic_art from 'assets/images/acrylic_art.jpg';
import charcoal_art from 'assets/images/charcoal_art.jpg';
import oil_art from 'assets/images/oil_art.jpg';
import photography_art from 'assets/images/photography_art.jpg';
import fabric_art from 'assets/images/fabric_art.jpg';
import mixedMedia from 'assets/images/mixed-media.png';
import ankara from 'assets/images/ankara.png';
import canvas from 'assets/images/onboarding-3.jpg';
import ink from 'assets/images/curated_bg.png';
import unnamed from 'assets/images/unnamed.jpg'

export const mediums = <CatalogCardTypes[]> [
    {name: 'Mixed media', value: 'Mixed media', image: mixedMedia},
    {name: 'Paper', value: 'Paper', image: unnamed},
    {name: 'Ankara', value: 'Ankara', image: ankara},
    {name: 'Oil', value: 'Oil', image: oil_art},
    {name: 'Canvas', value: 'Canvas', image: canvas},
    {name: 'Ink', value: 'Ink', image: ink},
    {name: 'Photography', value: 'Photography', image: photography_art},
    {name: 'Charcoal', value: 'Charcoal', image: charcoal_art},
    {name: 'Fabric', value: 'Fabric', image: fabric_art},
    {name: 'Acrylic', value: 'Acrylic', image: acrylic_art},
]