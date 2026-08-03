import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";

import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Input from "#components/inputs/Input";
import { useAppStore } from "#store/app/appStore";
import Preferences from "./components/Preferences";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { validate } from "#lib/validations/validatorGroup";
import { updateProfile } from "#services/update/updateProfile";
import { useModalStore } from "#store/modal/modalStore";
import { utils_storeAsyncData } from "#utils/utils_asyncStorage";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

type EditProfileErrorsTypes = {
  name: string;
};

export default function EditProfile() {
  const { userSession, setUserSession, userType } = useAppStore();
  const navigation = useNavigation<any>();

  const { updateModal } = useModalStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: userSession.name || "",
    email: userSession.email || "",
    phone: userSession.phone || "",
    preferences: userSession.preferences || [],
  });

  const [formErrors, setFormErrors] = useState<EditProfileErrorsTypes>({
    name: "",
  });

  const [isDirty, setIsDirty] = useState<boolean>(false);

  React.useEffect(() => {
    const isNameChanged = formData.name !== userSession.name;
    const isPhoneChanged = formData.phone !== userSession.phone;
    const isPrefsChanged =
      JSON.stringify([...formData.preferences].sort()) !==
      JSON.stringify([...(userSession.preferences || [])].sort());

    setIsDirty(isNameChanged || isPrefsChanged || isPhoneChanged);
  }, [formData, userSession]);

  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(value, label);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
    handleValidationChecks(label, value);
  };

  const checkIsDisabled = () => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = formData.name !== "" && formData.phone !== "";

    return !(isFormValid && areAllFieldsFilled && isDirty);
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    if (!userSession.id) return;

    if (formData.preferences.length < 5) {
      setIsLoading(false);
      updateModal({
        message: "Please select up to 5 preferences",
        modalType: "error",
        showModal: true,
      });
      return;
    }

    const data = {
      name: formData.name,
      phone: formData.phone,
      preferences: formData.preferences,
    };
    const routeType = userType === "user" ? "individual" : userType;

    const result = await updateProfile(routeType as any, data, userSession.id);

    if (result.isOk) {
      setIsLoading(false);
      const updatedSession = { ...userSession, ...data };
      setUserSession(updatedSession);
      await utils_storeAsyncData("userSession", JSON.stringify(updatedSession));

      updateModal({
        message: "Profile updated successfully",
        modalType: "success",
        showModal: true,
        onDismiss: () => navigation.goBack(),
      });
    } else {
      setIsLoading(false);
      updateModal({
        message: result.body.message,
        modalType: "error",
        showModal: true,
      });
    }
  };

  return (
    <>
      <BackHeaderTitle title="Edit profile" />
      <ScrollWrapper style={styles.container}>
        <View style={{ gap: 20, marginBottom: 40 }}>
          <Input
            label="Full name"
            value={formData.name}
            onInputChange={(text) => handleChange("name", text)}
            errorMessage={formErrors.name}
          />
          <Input
            label="Email address"
            value={formData.email}
            disabled
            onInputChange={(text) => {
              handleChange("email", text);
            }}
          />
          <Input
            label="Phone number"
            value={formData.phone}
            keyboardType="phone-pad"
            onInputChange={(text) => {
              handleChange("phone", text);
            }}
          />
          <View style={{ marginTop: 10, gap: 10 }}>
            <View style={tw`mb-2`}>
              <Text style={tw`text-sm font-semibold text-[#858585] mb-1`}>
                Full Address
              </Text>
              <View
                style={tw`bg-gray-100 p-4 rounded-sm border border-gray-300`}
              >
                {userSession.address.address_line ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>Address: </Text>
                    {userSession.address.address_line}
                    {"\n"}
                  </Text>
                ) : null}

                {userSession.address.city ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>City: </Text>
                    {userSession.address.city}
                    {"\n"}
                  </Text>
                ) : null}

                {userSession.address.state ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>State: </Text>
                    {userSession.address.state}
                    {"\n"}
                  </Text>
                ) : null}

                {userSession.address.zip ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>Zip Code: </Text>
                    {userSession.address.zip}
                    {"\n"}
                  </Text>
                ) : null}

                {userSession.address.country ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>Country: </Text>
                    {userSession.address.country}
                  </Text>
                ) : null}
              </View>
            </View>

            <LongBlackButton
              value="Edit address"
              onClick={() =>
                navigation.navigate("EditAddressScreen", {
                  currentAddress: userSession.address,
                })
              }
              isDisabled={false}
            />
          </View>

          <Preferences
            label="Preferences"
            selectedPreferences={formData.preferences}
            setSelectedPreferences={(preferences) => {
              setFormData((prev) => ({ ...prev, preferences }));
            }}
          />
        </View>
        <View style={tw`mb-[100px]`}>
          <LongBlackButton
            value="Update profile"
            onClick={handleUpdate}
            isDisabled={checkIsDisabled()}
            isLoading={isLoading}
          />
        </View>
      </ScrollWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 10,
  },
});
