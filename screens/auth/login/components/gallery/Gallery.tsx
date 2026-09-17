import React from "react";
import { useGalleryAuthLoginStore } from "#store/auth/login/GalleryAuthLoginStore";
import LoginForm from "#screens/auth/login/components/LoginForm";
import type { HandleLoginFn } from "#hooks/auth/loginSubmitOptions";

type GalleryProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
  handleLogin: HandleLoginFn;
  setSubmitLoading: (loading: boolean) => void;
}>;

export default function Gallery({
  biometricProps,
  handleLogin,
  setSubmitLoading,
}: GalleryProps) {
  const {
    galleryLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
  } = useGalleryAuthLoginStore();

  const handleSubmit = () =>
    handleLogin(galleryLoginData, setSubmitLoading, clearInputs);

  return (
    <LoginForm
      loginData={galleryLoginData}
      setEmail={setEmail}
      setPassword={setPassword}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      biometricProps={biometricProps}
      emailLabel="Email address"
      emailPlaceholder="Enter your email address"
      loginButtonLabel="Sign In Gallery"
      forgotPasswordType="gallery"
    />
  );
}
