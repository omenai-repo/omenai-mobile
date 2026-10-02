import React from "react";
import { Skeleton } from "moti/skeleton";
import { DimensionValue } from "react-native";

type SkeletonBoxProps = {
  width: DimensionValue;
  height: DimensionValue;
  radius?: number;
  colorMode?: "light" | "dark";
};

/**
 * Base skeleton component using Moti.
 * Follows the pattern established in OrderslistingLoader.tsx
 */
export default function SkeletonBox({
  width,
  height,
  radius = 4,
  colorMode = "light",
}: Readonly<SkeletonBoxProps>) {
  return (
    <Skeleton
      colorMode={colorMode}
      width={width}
      height={height}
      radius={radius}
    />
  );
}
