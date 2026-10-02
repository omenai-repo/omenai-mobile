import React, { useCallback } from "react";
import { Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

import LongBlackButton from "#components/buttons/LongBlackButton";
import {
  isSimulatorEnvironment,
  getArUnavailableMessage,
} from "#utils/hooks/isArEnvironmentSupported";
import { screenName } from "#constants/screenNames.constants";
import { parseArtworkDimensions } from "#lib/ar/parseArtworkDimensions";
import { getImageFileView } from "#lib/storage/getImageFileView";

type ViewInSpaceButtonProps = {
  artworkTitle: string;
  artworkUri: string;
  dimensions?: {
    height?: string;
    width?: string;
    length?: string;
  };
};

export default function ViewInSpaceButton({
  artworkTitle,
  artworkUri,
  dimensions,
}: Readonly<ViewInSpaceButtonProps>) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handlePress = useCallback(async () => {
    if (isSimulatorEnvironment()) {
      Alert.alert("AR not available", getArUnavailableMessage());
      return;
    }

    const parsedDimensions = parseArtworkDimensions(dimensions);
    const imageUri = getImageFileView(artworkUri, 1200);
    let imageAspectRatio: number | undefined;

    try {
      const { width, height } = await Image.getSize(imageUri);
      if (width > 0 && height > 0) imageAspectRatio = width / height;
    } catch {
      // The AR scene falls back to the artwork's physical dimensions.
    }

    navigation.navigate(screenName.arPreview, {
      artworkUri,
      artworkTitle,
      artworkWidth: parsedDimensions.width,
      artworkHeight: parsedDimensions.height,
      imageAspectRatio,
      dimensions,
    });
  }, [artworkTitle, artworkUri, dimensions, navigation]);

  return (
    <LongBlackButton
      value="View in your space"
      outline
      onClick={handlePress}
      icon={<Ionicons name="scan-outline" size={18} color="#000" />}
      testID="view-in-space-button"
      textStyle={tw`normal-case tracking-normal`}
      style={tw`flex-1 w-auto`}
    />
  );
}
