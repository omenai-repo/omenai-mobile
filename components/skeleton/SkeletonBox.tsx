import React from "react";
import { Skeleton } from "moti/skeleton";

type SkeletonBoxProps = {
  width: number;
  height: number;
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
