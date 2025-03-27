import React from 'react';
import AccountDetailsInput from './AccountDetailsInput';
import { useIndividualAuthRegisterStore } from 'store/auth/register/IndividualAuthRegisterStore';
import IndividualAddressVerification from './IndividualAddressVerification';
import Preferences from './Preferences';
import TermsAndConditions from './TermsAndConditions';

const IndividualRegistrationForm = () => {
  const { pageIndex } = useIndividualAuthRegisterStore();

  const forms = [
    <AccountDetailsInput />,
    <IndividualAddressVerification />,
    <Preferences />,
    <TermsAndConditions />,
  ];

  return forms[pageIndex];
};

export default IndividualRegistrationForm;
