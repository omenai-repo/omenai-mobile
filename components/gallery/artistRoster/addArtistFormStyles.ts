import { Platform } from "react-native";
import tw from "twrnc";

import { colors } from "#config/colors.config";

export const formFieldLabelStyle = [tw`text-sm mb-2.5`, { color: colors.inputLabel }];

export const formTextInputStyle = [
  tw`w-full rounded-md border px-4 text-sm`,
  {
    borderColor: colors.inputBorder,
    backgroundColor: "#FAFAFA",
    color: colors.black,
    height: 44,
    ...(Platform.OS === "android" ? { textAlignVertical: "center" as const } : {}),
  },
];
