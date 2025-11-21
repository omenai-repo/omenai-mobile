import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { releaseOrderLock } from "services/orders/releaseOrderLock";
import { useAppStore } from "store/app/appStore";
import { useModalStore } from "store/modal/modalStore";
import { colors } from "config/colors.config";
import { RefreshControl } from "react-native-gesture-handler";
import LongBlackButton from "components/buttons/LongBlackButton";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function CancleOrderPayment() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routes = useRoute();
  const { art_id } = routes.params as { art_id: string };

  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  useEffect(() => {
    async function unDoLock() {
      setIsLoading(true);
      const res = await releaseOrderLock(art_id, userSession.id);

      if (!res?.isOk) {
        updateModal({
          message: "Something went wrong, please refresh your page",
          modalType: "error",
          showModal: true,
        });
      }

      setIsLoading(false);
    }

    unDoLock();
  }, [art_id, updateModal, userSession.id]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView />
      <ScrollWrapper
        style={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} />}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 100,
          }}
        >
          <Image />
          <Text
            style={{
              fontSize: 18,
              color: colors.primary_black,
              fontWeight: 500,
            }}
          >
            Your transaction has been canceled
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              color: colors.grey,
              marginBottom: 40,
            }}
          >
            The payment for this artwork has been cancled, you can always try again later
          </Text>
          <LongBlackButton
            value="Return home"
            isLoading={isLoading}
            onClick={() => navigation.navigate("Individual")}
          />
        </View>
      </ScrollWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
});
