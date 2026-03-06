import acrylic_art from "#assets/images/acrylic_art.png";
import oil_art from "#assets/images/oil_art.png";
import photography_art from "#assets/images/photography_art.png";
import mixedMedia from "#assets/images/mixed_media_art.png";

export const mediums = <CatalogCardTypes[]>[
  { name: "Photography", value: "Photography", image: photography_art },
  {
    name: "Acrylic on canvas/linen/panel",
    value: "Acrylic on canvas/linen/panel",
    image: acrylic_art,
  },
  {
    name: "Mixed media on canvas/paper",
    value: "Mixed media on canvas/paper",
    image: mixedMedia,
  },
  { name: "Oil on canvas/panel", value: "Oil on canvas/panel", image: oil_art },
];
