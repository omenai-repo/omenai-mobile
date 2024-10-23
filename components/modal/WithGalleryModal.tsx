import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { colors } from "config/colors.config";
import { WithModalProps } from "./WithModal";
import { galleryOrderModalStore } from "store/modal/galleryModalStore";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import DeclineOrderModal from "./gallery/DeclineOrderModal";
import ProvideShippingQuoteModal from "./gallery/ProvideShippingQuoteModal";
import ProvideTrackingInfo from "./gallery/ProvideTrackingInfo";
import OrderDetailsModal from "./gallery/OrderDetailsModal";
import DeleteAccountModal from "./gallery/DeleteAccountModal";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function WithGalleryModal({ children }: WithModalProps) {
  const { isVisible, modalType, setModalType } = galleryOrderModalStore();

  const modals = {
    decline: <DeclineOrderModal />,
    accept: <ProvideShippingQuoteModal />,
    provideTrackingInfo: <ProvideTrackingInfo />,
    details: <OrderDetailsModal />,
    deleteAccount: <DeleteAccountModal />,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {children}

      <Modal
        isVisible={isVisible}
        backdropOpacity={0.2}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
      >
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <ScrollWrapper>
              <SafeAreaView>
                <View style={styles.scrollContainer}>
                  <View style={styles.mainContainer}>{modals[modalType]}</View>
                </View>
              </SafeAreaView>
            </ScrollWrapper>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    left: -10,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
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
  },
});
