import { images } from "#constants/images.constants";

export type onboardingdataTypes = {
  title: string;
  image: string;
  subText: string;
};

export const onboardingdata = [
  {
    title: "Contemporary African Art, Curated",
    image: images.onboardingImageOne,
    subText:
      "Discover works from emerging and established artists across Africa and its diaspora.",
  },
  {
    title: "Meet the Artists Shaping the Future",
    image: images.onboardingImageTwo,
    subText:
      "Discover rising and established artists across Africa and its diaspora.",
  },
] as onboardingdataTypes[];
