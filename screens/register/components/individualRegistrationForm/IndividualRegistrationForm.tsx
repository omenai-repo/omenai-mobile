import React from "react";
import AccountDetailsInput from "./AccountDetailsInput";
import { useIndividualAuthRegisterStore } from "store/auth/register/IndividualAuthRegisterStore";
import IndividualAddressVerification from "./IndividualAddressVerification";
import Preferences from "./Preferences";
import TermsAndConditions from "./TermsAndConditions";

const IndividualRegistrationForm = () => {
  const { pageIndex } = useIndividualAuthRegisterStore();

  const forms = [
    <AccountDetailsInput key="account-details" />,
    <IndividualAddressVerification key="address-verification" />,
    <Preferences key="preferences" />,
    <TermsAndConditions key="terms-and-conditions" />,
  ];

  return forms[pageIndex];
};

export default IndividualRegistrationForm;
