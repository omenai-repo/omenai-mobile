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
      tailwind`flex-row gap-[20px] p-[15px] rounded-lg bg-[#f5f5f5]`,
      width ? { width } : { flex: 1 },
    ]}
  >
    <View style={{ flex: 1 }}>
      <View style={{ height: 25, backgroundColor: "#ddd" }} />
      <View style={{ marginTop: 20, gap: 10 }}>
        <View style={{ height: 20, backgroundColor: "#ddd" }} />
        <View style={{ height: 20, backgroundColor: "#ddd" }} />
      </View>
    </View>
    <View
      style={{
        height: "100%",
        width: 170,
        backgroundColor: "#ddd",
        borderRadius: 15,
      }}
    />
  </View>
);

export default function BannerLoader({
  isTablet,
  cardWidth,
}: BannerLoaderProps) {
  const skeletonCount = isTablet ? 3 : 1;

  return (
    <View style={styles.container}>
      <View
        style={[
          tailwind`flex-row gap-[15px] px-[15px]`,
          !isTablet && { flex: 1 },
        ]}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonCard key={index} width={isTablet ? cardWidth : undefined} />
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
