import onboardingImageOne from '../assets/images/onboarding-1.jpg';
import onboardingImageTwo from '../assets/images/onboarding-2.jpg';
import onboardingImageThree from '../assets/images/onboarding-3.jpg';

export type onboardingdataTypes = { title: string; image: string; subText: string };

export const onboardingdata = <onboardingdataTypes[]>[
  {
    title: 'Access to countless artworks',
    image: onboardingImageOne,
    subText:
      'Discover artworks meticulously curated into various collections for your browsing pleasure.',
  },
  {
    title: 'Meet Emerging & Master Artists',
    image: onboardingImageTwo,
    subText:
      'Explore unique creations from both rising talents and established masters across the globe.',
  },
  {
    title: 'Find Your Next Favorite Piece',
    image: onboardingImageThree,
    subText: 'Personalized recommendations that evolve as you explore and save artworks you love.',
  },
];
