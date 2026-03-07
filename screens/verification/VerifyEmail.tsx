import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import AuthHeader from "#components/auth/AuthHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useModalStore } from "#store/modal/modalStore";
import Divider from "#components/general/Divider";
import { colors } from "#config/colors.config";
import { resendVerifyCode } from "#services/verify/resendVerifyCode";
import { verifyEmail } from "#services/verify/verifyEmail";
import { screenName } from "#constants/screenNames.constants";
import ScrollWrapper from "#components/general/ScrollWrapper";

export default function VerifyEmail() {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();

  const { account } = route.params as verifyEmailRouteParamsType;

  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [resending, setResending] = useState<boolean>(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyToken = async () => {
    setIsLoading(true);
    const results = await verifyEmail(
      { params: account.id, token: token },
      account.type,
    );

    if (results.isOk) {
      updateModal({
        message: results.body.message,
        modalType: "success",
        showModal: true,
        onDismiss: () => {
          navigation.navigate(screenName.login);
        },
      });
      setIsLoading(false);
    } else {
      updateModal({
        message: results.body.message,
        modalType: "error",
        showModal: true,
      });
      setIsLoading(false);
    }
  };

  const handleResentToken = async () => {
    try {
      setResending(true);
      const results = await resendVerifyCode(account.type, account.id);
      if (!results.isOk) throw new Error(results.body.message);
      setCountdown(60);
      updateModal({
        message: "A new verification code has been sent to your email.",
        modalType: "success",
        showModal: true,
      });
    } catch (error: any) {
      updateModal({
        message: error?.message || "An unexpected error occurred.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Verify email"
        subTitle={`Verify your account so you can start ${
          account.type === "gallery" || account.type === "artist"
            ? "selling"
            : "purchasing"
        } artworks`}
        handleBackClick={() => navigation.goBack()}
      />
      <ScrollWrapper style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        <Input
          placeHolder="Enter verification token"
          label="Token"
          onInputChange={(e) => setToken(e)}
          value={token}
        />
        <View style={{ marginTop: 30, marginBottom: 50 }}>
          <LongBlackButton
            value="Verify"
            onClick={handleVerifyToken}
            isLoading={isLoading}
            isDisabled={token.length < 4}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleResentToken}
          disabled={countdown > 0 || resending}
        >
          <View style={styles.resendCode}>
            <Text style={styles.extraText}>Did not recieve a code?</Text>
            <Text
              style={[
                styles.extraText,
                { textDecorationLine: "underline" },
                countdown > 0 ? { color: colors.primary_black + "80" } : {},
              ]}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ paddingVertical: 25 }}>
          <Divider />
        </View>
        <View style={styles.resendCode}>
          <Text style={styles.extraText}>
            Feel free to contact us should you have any issues on
          </Text>
          <Text style={[styles.extraText, { textDecorationLine: "underline" }]}>
            support@omenai.app
          </Text>
        </View>
      </ScrollWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  resendCode: {
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  extraText: {
    fontSize: 14,
    color: colors.primary_black,
  },
});
