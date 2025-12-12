import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import LongBlackButton from "../../../../components/buttons/LongBlackButton";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "#components/inputs/PasswordInput";
import WithModal from "#components/modal/WithModal";
import { screenName } from "#constants/screenNames.constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useArtistAuthLoginStore } from "#store/auth/login/ArtistAuthLoginStore";
import { useLoginHandler } from "#hooks/useLoginHandler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../../../config/colors.config";
import { SvgXml } from "react-native-svg";
import { faceIdIcon } from "#utils/SvgImages";

type ArtistProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void;
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
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = () =>
    handleLogin(artistLoginData, setIsLoading, clearInputs);

  return (
    <WithModal>
      <View style={tw`mt-7 gap-10`}>
        <View style={tw`gap-5`}>
          <Input
            label="Artist Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your email address"
            value={artistLoginData.email}
          />
          <PasswordInput
            label="Password"
            onInputChange={setPassword}
            placeHolder="Enter password"
            value={artistLoginData.password}
          />
        </View>
        <View style={tw`gap-5`}>
          <View style={tw`flex-row gap-3`}>
            <LongBlackButton
              value={isLoading ? "Loading ..." : "Sign In Artist"}
              isDisabled={!(artistLoginData.email && artistLoginData.password)}
              isLoading={isLoading}
              onClick={handleSubmit}
              style={[
                biometricProps.canUseBiometrics ? tw`flex-1` : tw`w-full`,
                { height: 52 },
              ]}
            />
            {biometricProps.canUseBiometrics && (
              <TouchableOpacity
                onPress={biometricProps.handleBiometricLogin}
                disabled={biometricProps.isBiometricLoading}
                style={[
                  tw`items-center justify-center rounded-lg h-[52px] w-[52px]`,
                  { backgroundColor: colors.black },
                ]}
              >
                {biometricProps.biometricName === "Face ID" ? (
                  <SvgXml xml={faceIdIcon} width={42} height={42} />
                ) : (
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={42}
                    color={colors.white}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(screenName.forgotPassword, { type: "artist" })
            }
          >
            <Text style={tw`text-sm text-center`}>
              Forgot password? Click here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </WithModal>
  );
}
