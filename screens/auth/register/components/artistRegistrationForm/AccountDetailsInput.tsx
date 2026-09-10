import React from "react";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import SharedAccountDetailsInput from "#screens/auth/register/components/shared/SharedAccountDetailsInput";

const AccountDetailsInput = () => {
  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useArtistAuthRegisterStore();

  return (
    <SharedAccountDetailsInput
      data={artistRegisterData}
      actions={{
        setName,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleNext: () => setPageIndex(pageIndex + 1),
      }}
      labels={{
        nameLabel: "Artist Name",
        namePlaceholder: "Enter your full name",
        emailLabel: "Artist email address",
        emailPlaceholder: "Enter your email address",
      }}
      pageIndex={pageIndex}
    />
  );
};

export default AccountDetailsInput;
