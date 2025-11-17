import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Animated as RNAnimated,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  Easing,
} from "react-native";
import { courselImages } from "constants/images.constants";
import tw from "twrnc";

type Props = {
  readonly primaryImages?: ImageSourcePropType[];
  readonly secondaryImages?: ImageSourcePropType[];
  readonly isActive?: boolean;
};

const NUM_ROWS = 5;
const NUM_ITEMS_PER_ROW = 4;
const ENABLE_ANIMATION = true;
const SHADES = ["#1a1a1a", "#2b2b2b", "#3c3c3c", "#222222", "#111111", "#2f2f2f"];
const ROW_BASE_DURATION = 120_000;

const GRID_DATA = Array.from({ length: NUM_ROWS }, (_, rowIndex) =>
  Array.from({ length: NUM_ITEMS_PER_ROW }, (_, colIndex) => ({
    id: `${rowIndex}-${colIndex}`,
    rowIndex,
    colIndex,
  }))
).flat();

const GridItem = React.memo(
  ({
    item,
    itemSize,
    backgroundColor,
    imageSource,
  }: {
    item: { id: string };
    itemSize: number;
    backgroundColor: string;
    imageSource?: ImageSourcePropType;
  }) => (
    <View
      style={{
        width: itemSize,
        height: itemSize,
        padding: 2,
      }}
    >
      {imageSource ? (
        <Image source={imageSource} style={tw`w-full h-full rounded-lg`} resizeMode="cover" />
      ) : (
        <View
          style={[
            tw`w-full h-full rounded-lg`,
            {
              backgroundColor,
            },
          ]}
        />
      )}
    </View>
  )
);
GridItem.displayName = "GridItem";

export default function TiltedGridBackground({
  primaryImages,
  secondaryImages,
  isActive = true,
}: Readonly<Props>) {
  const { width, height } = useWindowDimensions();
  const rowAnims = useRef(Array.from({ length: NUM_ROWS }, () => new RNAnimated.Value(0))).current;
  const itemSize = useMemo(() => (height * 1.5) / NUM_ROWS, [height]);
  const totalScrollDistance = useMemo(() => itemSize * NUM_ITEMS_PER_ROW, [itemSize]);

  const rows = useMemo(
    () =>
      Array.from({ length: NUM_ROWS }, (_, rowIndex) => ({
        id: `row-${Date.now()}-${rowIndex}`,
        items: GRID_DATA.filter((item) => item.rowIndex === rowIndex),
        rowIndex,
      })),
    []
  );

  const primary = useMemo(() => {
    if (primaryImages?.length) return primaryImages;
    return courselImages;
  }, [primaryImages]);
  const secondary = useMemo(() => {
    if (secondaryImages?.length) return secondaryImages;
    return Array.isArray(courselImages) ? [...courselImages].reverse() : courselImages;
  }, [secondaryImages]);

  useEffect(() => {
    if (!ENABLE_ANIMATION || !isActive) return;

    const animations = rowAnims.map((anim, i) => {
      anim.setValue(0);

      const animation = RNAnimated.timing(anim, {
        toValue: 1,
        duration: ROW_BASE_DURATION,
        useNativeDriver: true,
        easing: Easing.linear,
      });

      return RNAnimated.loop(animation);
    });

    for (const a of animations) a.start();
    return () => {
      for (const a of animations) a.stop();
    };
  }, [rowAnims, isActive]);

  return (
    <View
      style={{
        width: width * 2,
        height: height * 1.5,
        position: "absolute",
        left: -width * 0.5,
        top: (height - height * 1.5) / 2,
        transform: [{ rotateZ: "-15deg" }],
      }}
    >
      <View>
        {rows.map((row) => {
          // opposite translate based on row index
          const isMovingLeft = row.rowIndex % 2 === 0;
          const translate = rowAnims[row.rowIndex].interpolate({
            inputRange: [0, 1],
            outputRange: isMovingLeft
              ? [0, -totalScrollDistance] // Moves left
              : [-totalScrollDistance, 0], // Moves right
          });

          return (
            <RNAnimated.View key={row.id} style={{ transform: [{ translateX: translate }] }}>
              <View style={{ flexDirection: "row" }}>
                {/* Duplicated items for seamless loop */}
                {row.items.map((item, itemIndex) => {
                  const backgroundColor = SHADES[(row.rowIndex + itemIndex) % SHADES.length];
                  const images = (row.rowIndex % 2 === 0 ? primary : secondary) ?? [];
                  const imageSource = images.length
                    ? images[(row.rowIndex + itemIndex) % images.length]
                    : undefined;
                  return (
                    <GridItem
                      key={item.id}
                      item={item}
                      itemSize={itemSize}
                      backgroundColor={backgroundColor}
                      imageSource={imageSource}
                    />
                  );
                })}

                {/* Duplicated copy 2 */}
                {row.items.map((item, itemIndex) => {
                  const backgroundColor = SHADES[(row.rowIndex + itemIndex) % SHADES.length];
                  const images = (row.rowIndex % 2 === 0 ? primary : secondary) ?? [];
                  const imageSource = images.length
                    ? images[(row.rowIndex + itemIndex) % images.length]
                    : undefined;
                  return (
                    <GridItem
                      key={`${item.id}-clone`}
                      item={item}
                      itemSize={itemSize}
                      backgroundColor={backgroundColor}
                      imageSource={imageSource}
                    />
                  );
                })}
              </View>
            </RNAnimated.View>
          );
        })}
      </View>
      <View pointerEvents="none" style={tw`absolute inset-0 bg-black opacity-50`} />
    </View>
  );
}
