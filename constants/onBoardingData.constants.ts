import onboardingImageOne from '../assets/images/onboarding-1.jpg';
import onboardingImageTwo from '../assets/images/onboarding-2.jpg';
import onboardingImageThree from '../assets/images/onboarding-3.jpg';


export type onboardingdataTypes = {title: string, image: string, subText: string}

export const onboardingdata = <onboardingdataTypes[]> [
    {
        title: 'Access to countless artworks',
        image: onboardingImageOne,
        subText: 'Discover artworks meticulously curated into various collections for your browsing pleasure.',
    },
    {
        title: 'Title 2',
        image: onboardingImageTwo,
        subText: 'Discover artworks meticulously curated into various collections for your browsing pleasure.',
    },
    {
        title: 'Title 3',
        image: onboardingImageThree,
        subText: 'Discover artworks meticulously curated into various collections for your browsing pleasure.',
    },
]