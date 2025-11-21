import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CloseButton from "components/buttons/CloseButton";
import { useModalStore } from "store/modal/modalStore";
import LongBlackButton from "components/buttons/LongBlackButton";
import { colors } from "config/colors.config";
import { formatIntlDateTime } from "utils/utils_formatIntlDateTime";
import { useAppStore } from "store/app/appStore";
import { cancelSubscription } from "services/subscriptions/cancelSubscription";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";

export default function CancelSubscriptionModal() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setRetainModal, modalMessage, updateModal } = useModalStore();
  const { userSession } = useAppStore();

  const [loading, setLoading] = useState(false);

  async function handleCancelSubscription() {
    setLoading(true);

    const response = await cancelSubscription(userSession.id);

    if (response?.isOk) {
      handleCancleSuccess(response.message);
    } else {
      updateModal({
        message: "Something went wrong, try again later",
        showModal: true,
        modalType: "success",
      });
    }

    setLoading(false);
  }

  const handleCancleSuccess = (message: string) => {
    //remove confirmation modal first
    setRetainModal({ showModal: true, retainModal: null });

    //show success modal message
    updateModal({ message, showModal: true, modalType: "success" });

    setTimeout(() => {
      navigation.navigate(screenName.gallery.overview);
    }, 3500);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={{ fontSize: 16, flex: 1 }}>Cancle subscription</Text>
              <CloseButton
                handlePress={() => setRetainModal({ showModal: false, retainModal: null })}
              />
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: "#FDF7EF",
                borderRadius: 6,
                marginVertical: 20,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.primary_black }}>
                Are you sure? After{" "}
                <Text style={{ fontWeight: 500 }}>{formatIntlDateTime(modalMessage)}</Text>, you
                will be unable to upload artworks and events or use any of the services provided by
                Omenai Inc. All artworks uploaded will be suspended until your subscriptions are
                restarted.
              </Text>
            </View>
            <LongBlackButton
              value="Cancel subscription"
              onClick={handleCancelSubscription}
              isLoading={loading}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    left: -20,
    height: Dimensions.get("window").height,
    // justifyContent: 'flex-end'
  },
  scrollContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
  },
  mainContainer: {
    // height: 200,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 50,
  },
});
