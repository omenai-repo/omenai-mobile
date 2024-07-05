export type PlanProps = {
  name: string;
  monthly_price: { value: number; text: string };
  yearly_price: { value: number; text: string };
  benefits: string[];
};
export const plan_details: PlanProps[] = [
  {
    name: "Basic",
    monthly_price: { value: 150, text: "$150" },
    yearly_price: { value: 1500, text: "$1500" },
    benefits: [
      "30% commission excl. tax**",
      "Up to 25 artwork uploads",
      "International payment management",
      "Custom tailored Performance dashboard",
    ],
  },
  {
    name: "Pro",
    monthly_price: { value: 250, text: "$250" },
    yearly_price: { value: 2500, text: "$2500" },
    benefits: [
      "Includes all Basic plan services",
      "20% commission excl. tax**",
      "Unlimited artwork uploads monthly",
      "Priority customer support",
    ],
  },
  {
    name: "Premium",
    monthly_price: { value: 400, text: "$400" },
    yearly_price: { value: 4000, text: "$4000" },
    benefits: [
      "Includes all Basic & Pro plan services",
      "15% commission excl. tax**",
      "`Price on demand` feature on artworks",
      "Priority feature on hompage",
    ],
  },
];
