import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import OverviewContainer from "./OverviewContainer";
import { QuestionKey, questions } from "./ArtistOnboarding";
import * as DocumentPicker from "expo-document-picker";

interface CredentialsOverviewProps {
  readonly onboardingQuestions: Record<string, string>;
  readonly documentationSocials: Record<string, string>;
  readonly documentationCv: string;
  readonly cvAssets?: readonly DocumentPicker.DocumentPickerAsset[];
  readonly openSections: Record<string, boolean>;
  readonly toggleSection: (key: string) => void;
  readonly openEditModal: (
    key: QuestionKey | "cv" | "social",
    socialKey?: string,
  ) => void;
  readonly width: number;
}

const CredentialsOverview: React.FC<Readonly<CredentialsOverviewProps>> = ({
  onboardingQuestions,
  documentationSocials,
  documentationCv,
  cvAssets,
  openSections,
  toggleSection,
  openEditModal,
  width,
}) => {
  return (
    <View
      style={tw.style(
        `bg-[#fff] border border-[#E7E7E7] rounded-[23px] p-[20px]`,
        {
          marginHorizontal: width / 18,
        },
      )}
    >
      {/* Map through onboarding questions */}
      {Object.entries(onboardingQuestions)
        .filter(
          ([_, value]) => typeof value === "string" && value.trim() !== "",
        )
        .map(([key, value]) => {
          // Find the corresponding question text
          const questionText =
            questions.find((q) => q.key === key)?.text || key;

          return (
            <OverviewContainer
              key={key}
              index={key}
              title={questionText}
              data={String(value)}
              open={openSections[key]}
              setOpen={() => toggleSection(key)}
              openModal={() => openEditModal(key as QuestionKey)}
            />
          );
        })}

      {/* Map through documentation socials */}
      {Object.entries(documentationSocials)
        .filter(([_, value]) => value && value.trim() !== "")
        .map(([key, value]) => (
          <OverviewContainer
            key={key}
            index={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            data={value}
            open={openSections[key]}
            setOpen={() => toggleSection(key)}
            openModal={() => openEditModal("social", key)}
          />
        ))}

      {/* CV Section */}
      {documentationCv && (
        <OverviewContainer
          index={"CV Document"}
          title="CV Document"
          data={cvAssets ? cvAssets[0].name : ""}
          open={openSections["cv"]}
          setOpen={() => toggleSection("cv")}
          openModal={() => openEditModal("cv")}
        />
      )}
    </View>
  );
};

export default CredentialsOverview;
