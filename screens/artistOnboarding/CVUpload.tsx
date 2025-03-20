import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { uploadIcon, warningIconSm } from "utils/SvgImages";

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
          `border border-[#00000033] bg-[#EAE8E8] h-[160px] rounded-[5px] justify-center items-center`,
          {
            marginHorizontal: width / 12,
          }
        )}
      >
        {!cv?.assets && <SvgXml xml={uploadIcon} />}

        <Text
          style={tw`text-[12px] text-[#000000] font-medium mt-[15px] text-center mx-[30px]`}
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
          `border border-[#FFA500] mt-[20px] flex-row items-center gap-[10px] bg-[#FFF3E0] rounded-[8px] p-[15px]`,
          {
            marginHorizontal: width / 12,
          }
        )}
      >
        <SvgXml xml={warningIconSm} />
        <Text style={tw`text-[14px] text-[#FFA500] font-medium pr-[30px]`}>
          Please ensure your CV aligns with the answers you provided in the last
          sections
        </Text>
      </View>
    </View>
  );
};

export default CVUpload;
