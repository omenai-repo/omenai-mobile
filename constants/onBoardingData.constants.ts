import onboardingImageOne from "../assets/images/onboarding-1.jpg";
import onboardingImageTwo from "../assets/images/onboarding-2.jpg";

export type onboardingdataTypes = {
  title: string;
  image: string;
  subText: string;
};

export const onboardingdata = <onboardingdataTypes[]>[
  {
    title: "Contemporary African Art, Curated",
    image: onboardingImageOne,
    subText:
      "Discover works from emerging and established artists across Africa and its diaspora.",
  },
  {
    title: "Meet the Artists Shaping the Future",
    image: onboardingImageTwo,
    subText:
      "Discover rising and established artists across Africa and its diaspora.",
  },
];
