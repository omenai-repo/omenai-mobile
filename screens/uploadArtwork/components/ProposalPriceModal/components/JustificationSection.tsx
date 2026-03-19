import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { JustificationType } from "../types";

type JustificationSectionProps = {
  justificationType: JustificationType | "";
  proofFormat: "LINK" | "DOCUMENT";
  justificationUrl: string;
  justificationFileName: string;
  needsProof: boolean;
  onChangeJustificationType: (value: JustificationType) => void;
  onChangeProofFormat: (value: "LINK" | "DOCUMENT") => void;
  onChangeJustificationUrl: (value: string) => void;
  onPickProofDocument: () => void;
};

export default function JustificationSection({
  justificationType,
  proofFormat,
  justificationUrl,
  justificationFileName,
  needsProof,
  onChangeJustificationType,
  onChangeProofFormat,
  onChangeJustificationUrl,
  onPickProofDocument,
}: Readonly<JustificationSectionProps>) {
  return (
    <View style={tw`bg-white border border-neutral-200 rounded-md p-3 mb-4`}>
      <Text style={tw`text-sm font-sans-semibold text-gray-800 mb-1`}>
        Data Source / Justification
      </Text>
      <Text style={tw`text-xs text-gray-500 mb-3`}>
        Select the basis for this override request.
      </Text>

      <CustomSelectPicker
        label=""
        placeholder="Select your proof of value..."
        value={justificationType}
        data={[
          { label: "Past Sale of Similar Work", value: "PAST_SALE" },
          {
            label: "Part of Gallery Exhibition",
            value: "GALLERY_EXHIBITION",
          },
          { label: "Other", value: "OTHER" },
        ]}
        handleSetValue={(item) => {
          onChangeJustificationType(item.value as JustificationType);
        }}
        dropdownPosition="auto"
      />

      {needsProof && (
        <View style={tw`mt-3`}>
          <Text
            style={tw`text-[12px] font-sans-semibold text-neutral-700 mb-2`}
          >
            Verification Format
          </Text>

          <View style={tw`flex-row bg-neutral-100 rounded-md p-1 mb-3`}>
            <Pressable
              onPress={() => onChangeProofFormat("DOCUMENT")}
              style={[
                tw`flex-1 py-2 rounded-md items-center justify-center flex-row`,
                proofFormat === "DOCUMENT" ? tw`bg-white` : null,
              ]}
            >
              <Feather name="upload-cloud" size={14} color="#4B5563" />
              <Text style={tw`text-xs text-neutral-700 ml-1`}>Document</Text>
            </Pressable>

            <Pressable
              onPress={() => onChangeProofFormat("LINK")}
              style={[
                tw`flex-1 py-2 rounded-md items-center justify-center flex-row`,
                proofFormat === "LINK" ? tw`bg-white` : null,
              ]}
            >
              <Feather name="link" size={14} color="#4B5563" />
              <Text style={tw`text-xs text-neutral-700 ml-1`}>URL Link</Text>
            </Pressable>
          </View>

          {proofFormat === "LINK" ? (
            <View
              style={tw`border border-neutral-200 rounded-md px-3 flex-row items-center h-[46px]`}
            >
              <Feather name="link" size={14} color="#9CA3AF" />
              <TextInput
                value={justificationUrl}
                onChangeText={onChangeJustificationUrl}
                autoCapitalize="none"
                placeholder="https://example.com/your-proof"
                placeholderTextColor={colors.grey}
                style={[tw`flex-1 text-sm ml-2`, { color: colors.black }]}
              />
            </View>
          ) : (
            <Pressable
              onPress={onPickProofDocument}
              style={tw`border border-dashed border-neutral-300 rounded-md px-3 py-3`}
            >
              {justificationFileName ? (
                <View style={tw`flex-row items-center justify-between`}>
                  <Text
                    style={tw`text-xs text-neutral-700 flex-1 mr-2`}
                    numberOfLines={1}
                  >
                    {justificationFileName}
                  </Text>
                  <Text style={tw`text-xs text-red-500`}>Replace</Text>
                </View>
              ) : (
                <View style={tw`items-center`}>
                  <Feather name="upload-cloud" size={16} color="#6B7280" />
                  <Text style={tw`text-xs text-neutral-600 mt-1`}>
                    Tap to upload PDF or image proof
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
