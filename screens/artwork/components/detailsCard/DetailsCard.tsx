import { Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type DetailItemProps = {
  name: string;
  text: string;
};

type DetailCardProps = {
  title: string;
  details: DetailItemProps[];
};

export default function DetailsCard({ title, details }: DetailCardProps) {
  const DetailItem = ({ name, text }: DetailItemProps) => {
    return (
      <View style={tw`flex-row items-center gap-[16px]`}>
        <Text
          style={tw`text-neutral-400 font-sans text-[10px] tracking-wider uppercase w-2/6 pr-[16px]`}
        >
          {name}
        </Text>
        <Text
          style={tw`text-neutral-800 font-sans text-sm leading-relaxed w-4/6`}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <View style={tw`border border-neutral-200 rounded-sm`}>
      <View
        style={[
          tw`px-[16px] py-[16px] rounded-t-sm`,
          { backgroundColor: colors.black },
        ]}
      >
        <Text
          style={[
            tw`text-[13px] font-medium font-serif tracking-wide`,
            { color: colors.white },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={tw`px-[16px] py-[16px] gap-[16px]`}>
        {details.map((detail, idx) => (
          <DetailItem name={detail.name} text={detail.text} key={idx} />
        ))}
      </View>
    </View>
  );
}
