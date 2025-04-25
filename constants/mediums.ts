import acrylic_art from 'assets/images/acrylic_art.jpg';
import charcoal_art from 'assets/images/charcoal_art.jpg';
import oil_art from 'assets/images/oil_art.jpg';
import photography_art from 'assets/images/photography_art.jpg';
import fabric_art from 'assets/images/fabric_art.jpg';
import mixedMedia from 'assets/images/mixed-media.png';
import ankara from 'assets/images/ankara.png';
import canvas from 'assets/images/onboarding-3.jpg';
import ink from 'assets/images/curated_bg.png';
import unnamed from 'assets/images/unnamed.jpg';

export const mediums = <CatalogCardTypes[]>[
  { name: 'Mixed media on paper/canvas', value: 'Mixed media on paper/canvas', image: mixedMedia },
  { name: 'Works on paper', value: 'Works on paper', image: unnamed },
  {
    name: 'Sculpture (Resin/plaster/clay)',
    value: 'Sculpture (Resin/plaster/clay)',
    image: ankara,
  },
  { name: 'Oil on canvas/panel', value: 'Oil on canvas/panel', image: oil_art },
  { name: 'Canvas', value: 'Canvas', image: canvas },
  { name: 'Photography', value: 'Photography', image: photography_art },
  {
    name: 'Acrylic on canvas/linen/panel',
    value: 'Acrylic on canvas/linen/panel',
    image: acrylic_art,
  },
  {
    name: 'Sculpture (Bronze/stone/metal)',
    value: 'Sculpture (Bronze/stone/metal)',
    image: ink,
  },
];
