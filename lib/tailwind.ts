// @ts-ignore
import { create } from "twrnc-real";

const tw = create({
  theme: {
    extend: {
      fontFamily: {
        sans: "WorkSans-Light",
        serif: "PTSerif-Regular",
        "serif-bold": "PTSerif-Regular",
      },
      fontWeight: {
        light: "WorkSans-ExtraLight",
        normal: "WorkSans-Light",
        medium: "WorkSans-Regular",
        semibold: "WorkSans-Medium",
        bold: "WorkSans-SemiBold",
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
