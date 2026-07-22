import React, { useState } from "react";
import { Image, ImageProps, ImageStyle, StyleProp, View } from "react-native";
import { MotiView } from "moti";
import tw from "twrnc";

interface ProgressiveImageProps extends Omit<ImageProps, "source"> {
  thumbnailSource: { uri: string };
  source: { uri: string };
  containerStyle?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

const ProgressiveImage = ({
  thumbnailSource,
  source,
  containerStyle,
  imageStyle,
  ...props
}: ProgressiveImageProps) => {
  const [highResLoaded, setHighResLoaded] = useState(false);

  return (
    <View style={[tw`overflow-hidden bg-[#f5f5f5]`, containerStyle]}>
      {/* Thumbnail / Placeholder */}
      <Image
        {...props}
        source={thumbnailSource}
        style={[
          tw`absolute inset-0 w-full h-full`,
          imageStyle,
          { opacity: 0.6 },
        ]}
        resizeMode={props.resizeMode || "cover"}
        blurRadius={10}
      />

      {/* High-res Image (loads in background) */}
      <Image
        {...props}
        source={source}
        style={tw`absolute inset-0 w-0 h-0 opacity-0`}
        onLoad={() => setHighResLoaded(true)}
      />

      {/* Fade-in High-res Layer */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: highResLoaded ? 1 : 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={tw`absolute inset-0 w-full h-full`}
      >
        <Image
          {...props}
          source={source}
          style={[tw`w-full h-full`, imageStyle]}
          resizeMode={props.resizeMode || "cover"}
        />
      </MotiView>
    </View>
  );
};

export default ProgressiveImage;
