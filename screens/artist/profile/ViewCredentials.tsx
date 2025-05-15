import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import tw from 'twrnc';
import LottieView from 'lottie-react-native';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { getArtistCredentials } from 'services/artistOnboarding/getArtistCredentials';
import loaderAnimation from '../../../assets/other/loader-animation.json';
import { QuestionKey, questions } from 'screens/artistOnboarding/ArtistOnboarding';
import ViewItem from './ViewItem';

const { width } = Dimensions.get('window');

export default function ViewCredentialsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<any>(null);
  const animation = useRef(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await getArtistCredentials();
        const data = res?.body?.credentials;
        if (!data) return;
        setCredentials(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7] justify-center items-center`}>
        <LottieView
          autoPlay
          ref={animation}
          style={{ width: 300, height: 300 }}
          source={loaderAnimation}
        />
      </View>
    );
  }

  if (!credentials) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No credentials available.</Text>
      </View>
    );
  }

  const answers = credentials.categorization.answers;
  const documentation = credentials.documentation;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="View Credentials" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pt-[40px] pb-[150px]`}
      >
        <View
          style={tw.style(`bg-[#fff] border border-[#E7E7E7] rounded-[23px] p-[20px]`, {
            marginHorizontal: width / 18,
          })}
        >
          {/* Categorization Answers */}
          {Object.entries(answers).map(([key, value]) => {
            const questionText = questions.find((q) => q.key === key)?.text || key;
            if (!value || String(value).trim() === '') return null;
            return <ViewItem key={key} title={questionText} value={String(value)} />;
          })}

          {/* Social Links */}
          {/* {Object.entries(documentation?.socials).map(([key, value]) =>
            value ? <ViewItem key={key} title={key.toUpperCase()} value={String(value)} /> : null,
          )} */}

          {/* CV */}
          {/* {documentation?.cv && (
            <ViewItem title="CV Document" value={documentation.cv} isDownloadable />
          )} */}
        </View>
      </ScrollView>
    </View>
  );
}
