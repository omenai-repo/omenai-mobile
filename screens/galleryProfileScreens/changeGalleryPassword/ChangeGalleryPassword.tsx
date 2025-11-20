import { Text, View } from "react-native";
import React, { useState } from "react";
import WithModal from "components/modal/WithModal";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import Input from "components/inputs/Input";
import GetCodeButton from "./GetCodeButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import { validate } from "lib/validations/validatorGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { requestPasswordConfirmationCode } from "services/requests/requestConfirmationCode";
import { updatePassword } from "services/requests/updatePassword";
import { useModalStore } from "store/modal/modalStore";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function ChangeGalleryPassword({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
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

  function handleInputChange(name: string, value: string) {
    setErrorList([]);
    const { success, errors }: { success: boolean; errors: string[] | [] } = validate(
      value,
      name,
      info.password
    );
    if (!success) setErrorList(errors);

    setInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function requestConfirmationCode() {
    setCodeLoading(true);
    const response = await requestPasswordConfirmationCode(routeName);

    if (response?.isOk) {
      updateModal({
        modalType: "success",
        message: response.message,
        showModal: true,
      });
    } else {
      updateModal({
        modalType: "error",
        message: response?.message,
        showModal: true,
      });
    }

    setCodeLoading(false);
  }

  async function handlePasswordUpdate() {
    setLoading(true);
    const response = await updatePassword(info.password, info.code, routeName);

    if (response?.isOk) {
      updateModal({
        modalType: "success",
        message: response.message,
        showModal: true,
      });
      setInfo({
        password: "",
        confirmPassword: "",
        code: "",
      });
      navigation.goBack();
    } else {
      updateModal({
        modalType: "error",
        message: response?.message,
        showModal: true,
      });
    }

    setLoading(false);
  }

  return (
    <WithModal>
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
          <Input
            label="Password"
            value={info.password}
            placeHolder="Enter new password"
            onInputChange={(value) => handleInputChange("password", value)}
          />
          <Input
            label="Confirm password"
            value={info.confirmPassword}
            placeHolder="Confirm your new password"
            onInputChange={(value) => handleInputChange("confirmPassword", value)}
          />
          <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}>
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
              errorList.map((error, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginVertical: 5,
                    }}
                  >
                    <MaterialIcons name="error" color={"#ff000080"} />
                    <Text style={{ fontSize: 12, color: "#ff000080" }}>{error}</Text>
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
    </WithModal>
  );
}
