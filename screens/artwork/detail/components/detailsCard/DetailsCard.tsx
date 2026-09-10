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
      <View style={tw`flex-row items-center gap-4`}>
        <Text
          style={tw`text-neutral-600 font-sans-regular text-xs tracking-wide uppercase w-2/6 pr-4`}
        >
          {name}
        </Text>
        <Text
          style={tw`text-neutral-500 font-sans-regular text-sm leading-relaxed w-4/6 pr-2`}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <View style={tw`border border-neutral-200 rounded-sm`}>
      <View style={[tw`p-4 rounded-t-md`, { backgroundColor: colors.black }]}>
        <Text
          style={[
            tw`text-lg font-serif tracking-wider`,
            { color: colors.white },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={tw`p-4 gap-4`}>
        {details.map((detail, idx) => (
          <DetailItem name={detail.name} text={detail.text} key={idx} />
        ))}
      </View>
    </View>
  );
}
