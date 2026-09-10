import { Dimensions, StyleSheet, View } from "react-native";
import { ReactNode } from "react";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ConfirmationModalProps = {
  isVisible: boolean;
  child: ReactNode;
  onClose?: () => void;
};

export default function ConfirmationModal({
  isVisible,
  child,
  onClose,
}: ConfirmationModalProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16) + 8;

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.2}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={styles.container}>
        <View style={styles.scrollContainer}>
          <View
            style={[styles.mainContainer, { paddingBottom: bottomPadding }]}
          >
            {child}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    left: -20,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
  },
  scrollContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
  },
  mainContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
