import acrylic_art from 'assets/images/acrylic_art.webp';
import oil_art from 'assets/images/oil_art.webp';
import photography_art from 'assets/images/photography_art.webp';
import mixedMedia from 'assets/images/mixed_media_art.webp';
import sculpture from 'assets/images/bronze_art.webp';
import resin from 'assets/images/resin_art.webp';

export const mediums = <CatalogCardTypes[]>[
  { name: 'Mixed media on paper/canvas', value: 'Mixed media on paper/canvas', image: mixedMedia },
  {
    name: 'Sculpture (Resin/plaster/clay)',
    value: 'Sculpture (Resin/plaster/clay)',
    image: resin,
  },
  { name: 'Oil on canvas/panel', value: 'Oil on canvas/panel', image: oil_art },
  { name: 'Photography', value: 'Photography', image: photography_art },
  {
    name: 'Acrylic on canvas/linen/panel',
    value: 'Acrylic on canvas/linen/panel',
    image: acrylic_art,
  },
  {
    name: 'Sculpture (Bronze/stone/metal)',
    value: 'Sculpture (Bronze/stone/metal)',
    image: sculpture,
  },
];
