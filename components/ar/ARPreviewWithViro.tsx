import React from "react";

import ARRoomPreviewDevice from "#components/ar/ARRoomPreviewDevice";
import type { ARRoomPreviewProps } from "#components/ar/types";

export default function ARPreviewWithViro(props: ARRoomPreviewProps) {
  return <ARRoomPreviewDevice {...props} />;
}
