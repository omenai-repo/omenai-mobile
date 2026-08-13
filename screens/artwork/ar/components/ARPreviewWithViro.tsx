import React from "react";

import ArRoomPreviewDevice from "./ArRoomPreviewDevice";
import type { ARRoomPreviewProps } from "#types/ar";
import { Alert } from "react-native";

export default function ARPreviewWithViro(props: ARRoomPreviewProps) {
  Alert.alert("Hello", JSON.stringify(props));
  // return (
  //   <View>
  //     <Text>Hello</Text>
  //   </View>
  // );
  return <ArRoomPreviewDevice {...props} />;
}
