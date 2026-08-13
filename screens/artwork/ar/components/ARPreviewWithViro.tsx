import React from "react";

import ArRoomPreviewDevice from "./ArRoomPreviewDevice";
import type { ARRoomPreviewProps } from "#types/ar";

export default function ARPreviewWithViro(props: ARRoomPreviewProps) {
  return <ArRoomPreviewDevice {...props} />;
}
