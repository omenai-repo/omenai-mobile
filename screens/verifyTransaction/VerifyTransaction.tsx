import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";

import successImage from "assets/icons/success_check.png";
import errorImage from "assets/icons/error.png";
import LongBlackButton from "components/buttons/LongBlackButton";
import { subscriptionStepperStore } from "store/subscriptionStepper/subscriptionStepperStore";
import { verifyFlwTransaction } from "services/subscriptions/verifyFlwTransaction";
import Loader from "components/general/Loader";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { useAppStore } from "store/app/appStore";
import { utils_storeAsyncData } from "utils/utils_asyncStorage";
import { colors } from "config/colors.config";

export default function VerifyTransaction() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { setUserSession, userSession } = useAppStore();

  const { transaction_id, reset } = subscriptionStepperStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<{
    isOk: boolean;
    message: string;
    data?: any;
  }>();

  useEffect(() => {
    async function handleTransVerification() {
      setLoading(true);
      const response = await verifyFlwTransaction({ transaction_id });
      setVerified(response);
      setLoading(false);
    }

    handleTransVerification();
  }, []);

  async function handleViewSubscription() {
    const newUserSession = {
      ...userSession,
      subscription_active: true,
    };

    setUserSession(newUserSession);
    utils_storeAsyncData("userSession", JSON.stringify(newUserSession));

    //clear the checkout stepper store
    reset();

    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {loading && (
          <View>
            <Loader />
            <Text
              style={{
                alignSelf: "center",
              }}
            >
              Verification in progress...please wait
            </Text>
          </View>
        )}
        {!loading && verified && (
          <View style={{ paddingHorizontal: 20, paddingTop: 50 }}>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              {verified.message}
            </Text>
            {verified !== null && (
              <Image
                style={{
                  height: 100,
                  alignSelf: "center",
                  marginTop: 10,
                  marginBottom: 30,
                }}
                resizeMode="contain"
                source={verified.isOk ? successImage : errorImage}
              />
            )}
            <LongBlackButton
              value="Continue"
              onClick={handleViewSubscription}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
