import React from "react";
import { useArtistAuthLoginStore } from "#store/auth/login/ArtistAuthLoginStore";
import { useLoginHandler } from "#hooks/useLoginHandler";
import LoginForm from "../LoginForm";

type ArtistProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
}>;

export default function Artist({ biometricProps }: ArtistProps) {
  const {
    artistLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
    setIsLoading,
  } = useArtistAuthLoginStore();
  const { handleLogin } = useLoginHandler("artist");

  const handleSubmit = () =>
    handleLogin(artistLoginData, setIsLoading, clearInputs);

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
