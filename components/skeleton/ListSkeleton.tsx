import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

type ListSkeletonProps = {
  count?: number;
  colorMode?: "light" | "dark";
  itemHeight?: number;
  showImage?: boolean;
};

/**
 * Generic list skeleton loader for list-based screens.
 * Used for SavedArtworks, WalletHistory, Billing plans, etc.
 */
export default function ListSkeleton({
  count = 5,
  colorMode = "light",
  itemHeight = 80,
  showImage = true,
}: ListSkeletonProps) {
  const ListItem = () => (
    <View style={tw`flex-row items-center gap-4 py-3`}>
      {showImage && (
        <Skeleton
          colorMode={colorMode}
          height={itemHeight}
          width={itemHeight}
          radius={8}
        />
      )}
      <View style={tw`flex-1 gap-2`}>
        <Skeleton colorMode={colorMode} height={16} width="70%" radius={4} />
        <Skeleton colorMode={colorMode} height={14} width="50%" radius={4} />
        <Skeleton colorMode={colorMode} height={12} width="30%" radius={4} />
      </View>
    </View>
  );

  return (
    <View style={tw`px-5 pt-4`}>
      {Array.from({ length: count }).map((_, index) => (
        <ListItem key={index} />
      ))}
    </View>
  );
}
