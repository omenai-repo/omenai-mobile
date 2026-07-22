import { StyleSheet, View } from "react-native";
import React from "react";
import tailwind from "twrnc";

type BannerLoaderProps = {
  isTablet?: boolean;
  cardWidth?: number;
};

const SkeletonCard = ({ width }: { width?: number }) => (
  <View
    style={[
      tailwind`flex-row gap-[20px] p-[15px] bg-[#f5f5f5]`,
      width ? { width } : { flex: 1 },
    ]}
  >
    <View style={{ flex: 1 }}>
      <View style={tailwind`h-[25px] bg-[#ddd]`} />
      <View style={{ marginTop: 20, gap: 10 }}>
        <View style={tailwind`h-[20px] bg-[#ddd]`} />
        <View style={tailwind`h-[20px] bg-[#ddd]`} />
      </View>
    </View>
    <View style={[tailwind`h-full w-[170px] bg-[#ddd]`]} />
  </View>
);

export default function BannerLoader({
  isTablet,
  cardWidth,
}: Readonly<BannerLoaderProps>) {
  const skeletonCount = isTablet ? 3 : 1;

  const skeletonItems = React.useMemo(
    () => Array.from({ length: skeletonCount }).map((_, i) => `skeleton-${i}`),
    [skeletonCount],
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          tailwind`flex-row gap-[15px]`,
          !isTablet && { flex: 1 },
        ]}
      >
        {skeletonItems.map((key) => (
          <SkeletonCard key={key} width={isTablet ? cardWidth : undefined} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    flexDirection: "row",
  },
});
