export type ReasonOption = {
  id: string;
  label: string;
};

export const reasons: ReasonOption[] = [
  { id: "privacy_concerns", label: "Privacy Concerns" },
  { id: "better_alternative", label: "Found A Better Alternative" },
  { id: "too_expensive", label: "Too Expensive" },
  { id: "lack_of_features", label: "Lack Of Features" },
  { id: "other", label: "Other" },
];

export type DeletionProcessStep = {
  id: string;
  text: string;
  boldText?: string;
  linkText?: string;
  textAfter?: string;
};

export const deletionProcessSteps: DeletionProcessStep[] = [
  {
    id: "check_commitments",
    text: "We will check for any outstanding commitments (Orders paid for and processing).",
  },
  {
    id: "outstanding_commitments",
    text: "If there are outstanding commitments, deletion won't start — we'll show what needs resolving.",
  },
  {
    id: "grace_period",
    text: "Your account will be retained for ",
    boldText: "30 days",
    textAfter: ". You can log in to reactivate during this period.",
  },
  {
    id: "permanent_removal",
    text: "After the grace period, all data will be permanently removed. See our ",
    linkText: "privacy policy",
    textAfter: " for details.",
  },
];

export const MAX_MESSAGE_LENGTH = 150;
export const PRIVACY_POLICY_URL = "https://staging.dashboard.omenai.app/privacy";

