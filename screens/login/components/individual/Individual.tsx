import React from "react";
import { useIndividualAuthLoginStore } from "#store/auth/login/IndividualAuthLoginStore";
import LoginForm from "../LoginForm";
import type { HandleLoginFn } from "#hooks/loginSubmitOptions";

type IndividualProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
  handleLogin: HandleLoginFn;
  setSubmitLoading: (loading: boolean) => void;
}>;

export default function Individual({
  biometricProps,
  handleLogin,
  setSubmitLoading,
}: IndividualProps) {
  const {
    individualLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
  } = useIndividualAuthLoginStore();

  const handleSubmit = () =>
    handleLogin(individualLoginData, setSubmitLoading, clearInputs);

  return (
    <LoginForm
      loginData={individualLoginData}
      setEmail={setEmail}
      setPassword={setPassword}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      biometricProps={biometricProps}
      emailLabel="Email address"
      emailPlaceholder="Enter your email address"
      loginButtonLabel="Log In"
      forgotPasswordType="individual"
    />
  );
}
