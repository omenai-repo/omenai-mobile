import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { uploadIcon, warningIconSm } from "#utils/SvgImages";
import { colors } from "#config/colors.config";

type CVUploadProps = {
  cv: any;
  pickDocument: () => void;
};

const CVUpload = ({ cv, pickDocument }: CVUploadProps) => {
  const { width } = useWindowDimensions();
  return (
    <View>
      <TouchableOpacity
        onPress={pickDocument}
        style={tw.style(
          `border border-neutral-100 bg-neutral-200 h-[160px] rounded-sm justify-center items-center`,
          {
            marginHorizontal: width / 12,
          },
        )}
      >
        {!cv?.assets && <SvgXml xml={uploadIcon} />}

        <Text
          style={tw`text-sm text-[${colors.black}] font-sans-medium mt-[15px] text-center`}
        >
          {cv?.assets
            ? cv.assets[0].name.length > 40
              ? cv.assets[0].name.slice(0, 40)
              : cv.assets[0].name
            : "Upload your CV here"}
        </Text>
      </TouchableOpacity>

      {/* Warning Box */}
      <View
        style={tw.style(
          `border border-[#FFA500] mt-[20px] flex-row items-center gap-[10px] bg-[#FFF3E0] rounded-sm p-[15px]`,
          {
            marginHorizontal: width / 12,
          },
        )}
      >
        <SvgXml xml={warningIconSm} />
        <Text style={tw`text-sm text-[#FFA500] font-sans-medium pr-[30px]`}>
          Please ensure your CV aligns with the answers you provided in the last
          sections
        </Text>
      </View>
    </View>
  );
};

export default CVUpload;
