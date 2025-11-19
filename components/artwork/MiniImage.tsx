import { useImage, Image } from "expo-image";
import { useMemo } from "react";
import { View } from "react-native";

export default function MiniImage({
  maxWidth,
  url,
  name,
}: {
  url: string;
  maxWidth: number;
  name?: string;
}) {
  const imageOptions = useMemo(
    () => ({
      onError: (error: Error, retry: () => void) => {
        console.error("Loading failed:", error.message);
      },
    }),
    []
  );

  const image = useImage(url, imageOptions);

  const displayWidth = maxWidth - 10;

  if (!image) {
    return (
      <View
        style={{
          width: displayWidth,
          height: 200,
          backgroundColor: "#f5f5f5",
        }}
      />
    );
  }

  const aspectRatio = image.width / image.height;
  const displayHeight = displayWidth / aspectRatio;

  return (
    <Image
      source={image}
      style={{ width: displayWidth, height: displayHeight }}
      contentFit="cover"
    />
  );
}
