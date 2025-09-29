import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";

type SocialsProps = {
  socials: {
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
  };
  setSocials: (key: string, value: string) => void;
};

const Socials = ({ socials, setSocials }: SocialsProps) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={tw.style(`gap-[20px] mb-[50px]`, {
        marginHorizontal: width / 15,
      })}
    >
      <Input
        label="Instagram"
        keyboardType="default"
        onInputChange={(text) => setSocials("instagram", text)}
        placeHolder="Input your Instagram profile here"
        value={socials.instagram}
      />
      <Input
        label="Facebook"
        keyboardType="default"
        onInputChange={(text) => setSocials("facebook", text)}
        placeHolder="Input your facebook profile here"
        value={socials.facebook}
      />
      <Input
        label="Linkedin"
        keyboardType="default"
        onInputChange={(text) => setSocials("linkedin", text)}
        placeHolder="Input your linkedin profile here"
        value={socials.linkedin}
      />
      <Input
        label="X (Twitter)"
        keyboardType="default"
        onInputChange={(text) => setSocials("twitter", text)}
        placeHolder="Input your x profile here"
        value={socials.twitter}
      />
    </View>
  );
};

export default Socials;
