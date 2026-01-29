import React from "react";
import { useIndividualAuthLoginStore } from "#store/auth/login/IndividualAuthLoginStore";
import { useLoginHandler } from "#hooks/useLoginHandler";
import LoginForm from "../LoginForm";
import WithModal from "#components/modal/WithModal";
type IndividualProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
}>;

export default function Individual({ biometricProps }: IndividualProps) {
  const {
    individualLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
    setIsLoading,
  } = useIndividualAuthLoginStore();
  const { handleLogin } = useLoginHandler("individual");

  const handleSubmit = () =>
    handleLogin(individualLoginData, setIsLoading, clearInputs);

  return (
    <WithModal>
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
    </WithModal>
  );
}
