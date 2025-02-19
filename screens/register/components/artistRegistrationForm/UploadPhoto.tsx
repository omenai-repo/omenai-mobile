import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { plusIcon, userProfileIcon } from "utils/SvgImages";
import NextButton from "components/buttons/NextButton";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";

const UploadPhoto = () => {
  const { width, height } = useWindowDimensions();
  const { pageIndex, setPageIndex } = useArtistAuthRegisterStore();

  return (
    <View style={tw``}>
      <View style={tw`self-center mt-[20px]`}>
        <View
          style={tw.style(
            `rounded-full bg-[#D9D9D9] justify-center items-center`,
            {
              width: width / 2,
              height: height / 4.5,
            }
          )}
        >
          <SvgXml xml={userProfileIcon} />
        </View>
        <View
          style={tw.style(
            `h-[45px] bg-[#000000] w-[45px] bottom-[10px] right-[5px] absolute rounded-full justify-center items-center`
          )}
        >
          <SvgXml xml={plusIcon} />
        </View>
      </View>

      <Text
        style={tw.style(
          `text-[18px] text-[#00000099] self-center text-center`,
          {
            width: width / 1.5,
            marginTop: height / 20,
          }
        )}
      >
        Photo must be 1040 x 1040 Pixel, proffesionaly looking & clear.
      </Text>

      <View style={tw`flex-row mt-[60px]`}>
        <View style={{ flex: 1 }} />
        <NextButton
          // isDisabled={checkIsDisabled()}
          isDisabled={false}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

export default UploadPhoto;
