import { StyleSheet } from "react-native";
import React from "react";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import AccountDetailsInput from "./AccountDetailsInput";
import ExtraGalleryDetailsInput from "./ExtraGalleryDetailsInput";
import TermsAndConditions from "./TermsAndConditions";
import UploadLogo from "./UploadLogo";
import GalleryAddressVerification from "./GalleryAddressVerification";

export default function GalleryRegisterForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();

  const forms = [
    <AccountDetailsInput />,
    <GalleryAddressVerification />,
    <ExtraGalleryDetailsInput />,
    <UploadLogo />,
    <TermsAndConditions />,
  ];

  return forms[pageIndex];
}
