// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { create } from "twrnc-real";

const tw = create({
  theme: {
    extend: {
      fontFamily: {
        sans: "WorkSans-Light",
        "sans-regular": "WorkSans-Regular",
        "sans-medium": "WorkSans-Medium",
        "sans-semibold": "WorkSans-SemiBold",
        "sans-bold": "WorkSans-Bold",
        "sans-extrabold": "WorkSans-ExtraBold",
        "sans-black": "WorkSans-Black",
        serif: "PTSerif-Regular",
        "serif-italic": "PTSerif-Italic",
        "serif-bold": "PTSerif-Bold",
        "serif-bold-italic": "PTSerif-BoldItalic",
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      fontSize: {
        xs: ["10px", "14px"],
        sm: ["12px", "16px"],
        base: ["14px", "20px"],
        lg: ["16px", "24px"],
        xl: ["18px", "28px"],
        "2xl": ["20px", "32px"],
        "3xl": ["24px", "36px"],
        "4xl": ["30px", "44px"],
        "5xl": ["38px", "52px"],
      },
    },
  },
});

export default tw;
