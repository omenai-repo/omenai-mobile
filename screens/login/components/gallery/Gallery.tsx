import React from "react";
import { useGalleryAuthLoginStore } from "#store/auth/login/GalleryAuthLoginStore";
import WithModal from "#components/modal/WithModal";
import { useLoginHandler } from "#hooks/useLoginHandler";
import LoginForm from "../LoginForm";

type GalleryProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
}>;

export default function Gallery({ biometricProps }: GalleryProps) {
  const {
    galleryLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
    setIsLoading,
  } = useGalleryAuthLoginStore();
  const { handleLogin } = useLoginHandler("gallery");

  const handleSubmit = () =>
    handleLogin(galleryLoginData, setIsLoading, clearInputs);

  return (
    <WithModal>
      <LoginForm
        loginData={galleryLoginData}
        setEmail={setEmail}
        setPassword={setPassword}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        biometricProps={biometricProps}
        emailLabel="Gallery Email address"
        emailPlaceholder="Enter your gallery email address"
        loginButtonLabel="Sign In Gallery"
        forgotPasswordType="gallery"
      />
    </WithModal>
  );
}
