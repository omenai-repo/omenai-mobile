import React from "react";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import SharedAccountDetailsInput from "../shared/SharedAccountDetailsInput";

export default function AccountDetailsInput() {
  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useGalleryAuthRegisterStore();

  return (
    <SharedAccountDetailsInput
      data={galleryRegisterData}
      actions={{
        setName,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleNext: () => setPageIndex(pageIndex + 1),
      }}
      labels={{
        nameLabel: "Gallery Name",
        namePlaceholder: "Enter the name of your gallery",
        emailLabel: "Gallery's email address",
        emailPlaceholder: "Enter your gallery's email address",
      }}
      pageIndex={pageIndex}
    />
  );
}
