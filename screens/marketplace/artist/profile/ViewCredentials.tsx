import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { getArtistCredentials } from "#services/auth/getArtistCredentials";
import { questions } from "#components/auth/artistOnboarding/onboardingQuestions";
import ViewItem from "./ViewItem";
import { getDocFileView } from "#lib/storage/getDocFileView";
import CredentialsSkeleton from "#components/skeleton/CredentialsSkeleton";

const { width } = Dimensions.get("window");

export default function ViewCredentialsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<any>(null);
  const [cv, setCv] = useState("");

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await getArtistCredentials();
        const data = res?.body;
        if (!data) return;
        setCredentials(data);
        const cvUrl = getDocFileView(data.documentation.cv);
        setCv(cvUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  if (isLoading) {
    return <CredentialsSkeleton />;
  }

  if (!credentials) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No credentials available.</Text>
      </View>
    );
  }

  const answers = credentials.credentials.categorization.answers;
  const documentation = credentials.documentation;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="View Credentials" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pt-[40px] pb-[150px]`}
      >
        <View
          style={tw.style(
            `bg-[#fff] border border-[#E7E7E7] rounded-[23px] p-[20px]`,
            {
              marginHorizontal: width / 18,
            },
          )}
        >
          {/* Categorization Answers */}
          {Object.entries(answers).map(([key, value]) => {
            const questionText =
              questions.find((q) => q.key === key)?.text || key;
            const valStr = typeof value === "string" || typeof value === "number" ? String(value) : "";
            if (!valStr || valStr.trim() === "") return null;
            return (
              <ViewItem key={key} title={questionText} value={valStr} />
            );
          })}

          {/* Social Links */}
          {Object.entries(documentation?.socials).map(([key, value]) => {
            const valStr = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return valStr ? (
              <ViewItem
                key={key}
                title={key.toUpperCase()}
                value={valStr}
              />
            ) : null;
          })}

          {/* CV */}
          {cv && <ViewItem title="CV Document" value={cv} isDownloadable />}
        </View>
      </ScrollView>
    </View>
  );
}
