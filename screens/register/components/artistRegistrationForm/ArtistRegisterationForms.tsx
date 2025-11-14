import React from "react";
import AccountDetailsInput from "./AccountDetailsInput";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import ArtistHomeAddressVerification from "./ArtistHomeAddressVerification";
import UploadPhoto from "./UploadPhoto";
import ArtistPreference from "./ArtistPreference";
import TermsAndCondition from "./TermsAndCondition";

const ArtistRegisterationForms = () => {
  const { pageIndex } = useArtistAuthRegisterStore();

  const forms = [
    <AccountDetailsInput key="account-details" />,
    <ArtistHomeAddressVerification key="home-address-verification" />,
    <UploadPhoto key="upload-photo" />,
    <ArtistPreference key="preference" />,
    <TermsAndCondition key="terms-and-conditions" />,
  ];

  return forms[pageIndex];
};

export default ArtistRegisterationForms;
