import tw from "twrnc";
import { colors } from "config/colors.config";

export const termsAndConditionsStyles = {
  title: [tw`font-medium text-base`, { color: colors.primary_black }],
  buttonsContainer: tw`flex-row gap-2.5 items-center justify-between mt-10`,
  termsContainer: [
    tw`mt-3 bg-[#FAFAFA] rounded-lg border px-3 py-4`,
    { borderColor: colors.inputBorder, gap: 30 },
  ],
};
