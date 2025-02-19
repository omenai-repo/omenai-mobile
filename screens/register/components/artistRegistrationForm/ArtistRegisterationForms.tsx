import React from "react";
import AccountDetailsInput from "./AccountDetailsInput";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import ArtistHomeAddressVerification from "./ArtistHomeAddressVerification";
import UploadPhoto from "./UploadPhoto";
import ArtistPreference from "./ArtistPreference";

const ArtistRegisterationForms = () => {
  const { pageIndex } = useArtistAuthRegisterStore();

  const forms = [
    <AccountDetailsInput />,
    <ArtistHomeAddressVerification />,
    <UploadPhoto />,
    <ArtistPreference />,
  ];

  return forms[pageIndex];
};

export default ArtistRegisterationForms;
