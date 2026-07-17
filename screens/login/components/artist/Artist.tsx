import React from "react";
import { useArtistAuthLoginStore } from "#store/auth/login/ArtistAuthLoginStore";
import LoginForm from "../LoginForm";
import type { HandleLoginFn } from "#hooks/loginSubmitOptions";

type ArtistProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
  handleLogin: HandleLoginFn;
  setSubmitLoading: (loading: boolean) => void;
}>;

export default function Artist({
  biometricProps,
  handleLogin,
  setSubmitLoading,
}: ArtistProps) {
  const {
    artistLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
  } = useArtistAuthLoginStore();

  const handleSubmit = () =>
    handleLogin(artistLoginData, setSubmitLoading, clearInputs);

  return (
    <LoginForm
      loginData={artistLoginData}
      setEmail={setEmail}
      setPassword={setPassword}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      biometricProps={biometricProps}
      emailLabel="Email address"
      emailPlaceholder="Enter your email address"
      loginButtonLabel="Sign In Artist"
      forgotPasswordType="artist"
    />
  );
}
