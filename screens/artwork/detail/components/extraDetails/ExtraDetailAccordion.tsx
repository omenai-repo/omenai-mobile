import { Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

interface ExtraDetailAccordionProps {
  title: string;
  items: {
    text: string;
    icon?: React.ReactNode;
    hasLeftBorder?: boolean;
    onPress?: () => void;
  }[];
}

export default function ExtraDetailAccordion({
  title,
  items,
}: Readonly<ExtraDetailAccordionProps>) {
  const [expand, setExpand] = useState(false);

  const handleToggle = () => {
    setExpand(!expand);
  };

  return (
    <View style={tw`bg-white rounded-sm px-4 border border-neutral-200`}>
      <Pressable onPress={handleToggle} style={tw`py-4 flex-row items-center`}>
        <Text
          style={tw`text-sm uppercase font-sans-regular text-neutral-600 flex-1`}
        >
          {title}
        </Text>

        <Feather
          name={expand ? "minus" : "plus"}
          size={20}
          style={tw`text-neutral-600`}
        />
      </Pressable>

      {expand && (
        <Animated.View
          entering={FadeInDown.duration(600).damping(300)}
          exiting={FadeOut.duration(500).damping(300)}
          style={tw`pb-4`}
        >
          <View style={tw`h-[1px] w-full bg-neutral-200`} />
          <View style={tw`gap-4 pt-4`}>
            {items.map((item, index) => {
              const content = (
                <View
                  key={item.text || index.toString()}
                  style={tw.style(
                    `flex-row items-center gap-3`,
                    item.hasLeftBorder && `border-l border-neutral-200 pl-3`,
                  )}
                >
                  {item?.icon}
                  <Text
                    style={tw.style(
                      `text-sm flex-1`,
                      item.onPress
                        ? `text-blue-500 underline`
                        : `text-neutral-500`,
                    )}
                  >
                    {item.text}
                  </Text>
                </View>
              );

              if (item.onPress) {
                return (
                  <Pressable
                    key={item.text || index.toString()}
                    onPress={item.onPress}
                  >
                    {content}
                  </Pressable>
                );
              }
              return content;
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
