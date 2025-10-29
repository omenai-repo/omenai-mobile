import { Dimensions, StyleSheet, View } from "react-native";
import { ReactNode } from "react";
import Modal from "react-native-modal";

export default function ConfirmationModal({
  isVisible,
  child,
}: {
  isVisible: boolean;
  child: ReactNode;
}) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.2}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
    >
      <View style={styles.container}>
        <View style={styles.scrollContainer}>
          <View style={styles.mainContainer}>{child}</View>
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
    // height: 200,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
