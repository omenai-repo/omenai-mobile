import { Text, View } from "react-native";
import React, { useState } from "react";

import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Input from "#components/inputs/Input";
import GetCodeButton from "./GetCodeButton";
import PasswordInput from "#components/inputs/PasswordInput";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { validate } from "#lib/validation/validatorGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { requestPasswordConfirmationCode } from "#services/account/requests/requestConfirmationCode";
import { updatePassword } from "#services/account/requests/updatePassword";
import { useModalStore } from "#store/account/modal/modalStore";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { useBiometrics, UserType } from "#hooks/auth/useBiometrics";
import { useAppStore } from "#store/app/appStore";

export default function ChangePassword({
  route,
  navigation,
}: {
  readonly route: any;
  readonly navigation: any;
}) {
  const { routeName } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [info, setInfo] = useState({
    password: "",
    confirmPassword: "",
    code: "",
  });

  const [errorList, setErrorList] = useState<string[]>([]);

  const { updateModal } = useModalStore();
  const { deleteCredentials } = useBiometrics();
  const { userType } = useAppStore();

  function handleInputChange(name: string, value: string) {
    setErrorList([]);
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(value, name, info.password);
    if (!success) setErrorList(errors);

    setInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function requestConfirmationCode() {
    setCodeLoading(true);
    const response = await requestPasswordConfirmationCode(routeName);

    if (!response?.isOk) {
      updateModal({
        modalType: "error",
        message: response?.body?.message,
        showModal: true,
      });
      setCodeLoading(false);
      return;
    }

    updateModal({
      modalType: "success",
      message: response?.body?.message,
      showModal: true,
    });

    setCodeLoading(false);
  }

  async function handlePasswordUpdate() {
    setLoading(true);
    const response = await updatePassword(info.password, info.code, routeName);

    if (!response?.isOk) {
      updateModal({
        modalType: "error",
        message: response?.body?.message,
        showModal: true,
      });
      setLoading(false);
      return;
    }

    if (userType) await deleteCredentials(userType as UserType);
    setInfo({
      password: "",
      confirmPassword: "",
      code: "",
    });
    updateModal({
      modalType: "success",
      message: response?.body?.message,
      showModal: true,
      onDismiss: () => {
        navigation.goBack();
      },
    });

    setLoading(false);
  }

  return (
    <>
      <BackHeaderTitle title="Change password" />
      <ScrollWrapper
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 10,
          marginTop: 10,
        }}
      >
        <View style={{ gap: 20, marginBottom: 50 }}>
          <PasswordInput
            label="Password"
            value={info.password}
            placeHolder="Enter new password"
            onInputChange={(value) => handleInputChange("password", value)}
          />
          <PasswordInput
            label="Confirm password"
            value={info.confirmPassword}
            placeHolder="Confirm your new password"
            onInputChange={(value) =>
              handleInputChange("confirmPassword", value)
            }
          />
          <View
            style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}
          >
            <View style={{ flex: 1 }}>
              <Input
                label="Confirmation code"
                value={info.code}
                placeHolder="Enter confirmation code"
                onInputChange={(value) => handleInputChange("code", value)}
                keyboardType="numeric"
              />
            </View>
            <GetCodeButton
              value="Get code"
              onClick={requestConfirmationCode}
              isDisabled={
                loading ||
                errorList.length > 0 ||
                info.confirmPassword === "" ||
                info.password === ""
              }
              isLoading={codeLoading}
            />
          </View>
          <View>
            {errorList.length > 0 &&
              errorList.map((error) => {
                return (
                  <View
                    key={error}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginVertical: 5,
                    }}
                  >
                    <MaterialIcons name="error" color={"#ff000080"} />
                    <Text style={{ fontSize: 12, color: "#ff000080" }}>
                      {error}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
        <LongBlackButton
          onClick={handlePasswordUpdate}
          value={loading ? "loading..." : "Update password"}
          isDisabled={
            errorList.length > 0 ||
            info.code === "" ||
            info.confirmPassword === "" ||
            info.password === ""
          }
          isLoading={loading}
        />
      </ScrollWrapper>
    </>
  );
}
