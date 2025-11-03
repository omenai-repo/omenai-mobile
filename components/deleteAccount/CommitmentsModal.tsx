import React, { useEffect, useMemo, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import LongBlackButton from "components/buttons/LongBlackButton";

type Commitment = {
  type: string;
  description: string;
  metadata?: Record<string, any>;
};

type CommitmentsModalProps = Readonly<{
  isVisible: boolean;
  commitments: Commitment[];
  onClose: () => void;
}>;

export default function CommitmentsModal({
  isVisible,
  commitments,
  onClose,
}: CommitmentsModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Calculate content height for snap points (prevents extra scrolling)
  const contentHeight = useMemo(() => {
    const headerHeight = 100; // Icon + title + description
    const commitmentHeight = 75; // Per commitment item
    const buttonHeight = 55; // LongBlackButton height
    const paddingTop = 20;
    const handleHeight = 24;
    const headerToListSpacing = 32; // mb-8
    const itemGap = 12; // gap-3 between items
    const listToButtonSpacing = 24; // mb-6

    const totalGaps =
      headerToListSpacing +
      (commitments.length > 0 ? (commitments.length - 1) * itemGap : 0) +
      listToButtonSpacing;

    return (
      paddingTop +
      handleHeight +
      headerHeight +
      totalGaps +
      commitments.length * commitmentHeight +
      buttonHeight
    );
  }, [commitments.length]);

  const snapPoints = useMemo(() => [contentHeight], [contentHeight]);

  useEffect(() => {
    if (isVisible && commitments && commitments.length > 0) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, commitments]);

  if (!commitments || commitments.length === 0) {
    return null;
  }

  const formatType = (type: string): string => {
    return type
      .split("_")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const generateCommitmentKey = (type: string, description: string): string => {
    const descriptionHash = description
      .split("")
      .reduce((hash, char) => hash + char.charCodeAt(0), 0)
      .toString(36);
    return `${type}-${descriptionHash}`;
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      onPress={onClose}
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.backgroundStyle}
      handleIndicatorStyle={styles.handleIndicator}
      bottomInset={0}
      topInset={0}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
    >
      <BottomSheetView style={styles.content}>
        <View style={tw`flex-row items-start gap-3 mb-8`}>
          <View
            style={tw`w-12 h-12 rounded-full bg-yellow-50 items-center justify-center flex-shrink-0`}
          >
            <MaterialIcons name="warning" size={24} color="#D97706" />
          </View>
          <View style={tw`flex-1`}>
            <Text
              style={tw`text-[18px] font-semibold text-[${colors.primary_black}] mb-1`}
            >
              Outstanding commitments
            </Text>
            <Text style={tw`text-[14px] text-[${colors.grey}]`}>
              We can&apos;t start the deletion process until the following items
              are resolved:
            </Text>
          </View>
        </View>

        <View style={tw`gap-3 mb-6`}>
          {commitments.map((commitment) => (
            <View
              key={generateCommitmentKey(
                commitment.type,
                commitment.description
              )}
              style={tw`flex-row items-start gap-3`}
            >
              <View style={tw`mt-1`}>
                <Entypo name="warning" size={20} color="#D97706" />
              </View>
              <View style={tw`flex-1`}>
                <Text
                  style={tw`text-[14px] font-semibold text-[${colors.primary_black}] mb-1`}
                >
                  {formatType(commitment.type)}
                </Text>
                <Text style={tw`text-[14px] text-[${colors.grey}]`}>
                  {commitment.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <LongBlackButton
          value="I understand, Go back"
          onClick={onClose}
          bgColor={colors.primary_black}
          textColor={colors.white}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  backgroundStyle: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "#C4C4C4",
    width: 40,
    height: 4,
  },
});
