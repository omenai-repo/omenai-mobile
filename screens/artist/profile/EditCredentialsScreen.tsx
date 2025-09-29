import BackHeaderTitle from 'components/header/BackHeaderTitle';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { QuestionKey, questions } from 'screens/artistOnboarding/ArtistOnboarding';
import OverviewContainer from 'screens/artistOnboarding/OverviewContainer';
import QuestionContainer from 'screens/artistOnboarding/QuestionContainer';
import tw from 'twrnc';
import { uploadIcon } from 'utils/SvgImages';
import * as DocumentPicker from 'expo-document-picker';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { getArtistCredentials } from 'services/artistOnboarding/getArtistCredentials';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/other/loader-animation.json';

const { width } = Dimensions.get('window');

export default function EditCredentialsScreen() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuestionKey, setEditingQuestionKey] = useState<
    QuestionKey | 'cv' | 'social' | null
  >(null);
  const [editingSocialKey, setEditingSocialKey] = useState<string | null>(null);
  const [cv, setCv] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<any>(null);

  // Dummy onboarding questions
  const [onboardingQuestions, setOnboardingQuestions] = useState<{ [key in QuestionKey]?: string }>(
    {
      bio: '',
      graduate: '',
      mfa: '',
      solo: '',
      group: '',
      museum_collection: '',
      biennale: '',
      museum_exhibition: '',
      art_fair: '',
    },
  );

  // Dummy documentation
  const [documentation, setDocumentation] = useState({
    socials: {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: '',
    },
    cv: '',
  });
  const animation = useRef(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openEditModal = (key: QuestionKey | 'cv' | 'social', socialKey?: string) => {
    setEditingQuestionKey(key as QuestionKey);
    setEditingSocialKey(socialKey || null); // Store which social media is being edited
    setIsEditModalVisible(true);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.canceled || !result.assets) return;
    setCv(result);
    setDocumentation((prev) => ({ ...prev, cv: result.assets[0].uri }));
  };

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await getArtistCredentials();
        const data = res?.body?.credentials;
        if (!data) return;

        setCredentials(data);
        const answers = data.categorization.answers;

        setOnboardingQuestions({
          graduate: answers.graduate,
          mfa: answers.mfa,
          solo: String(answers.solo),
          group: String(answers.group),
          museum_collection: answers.museum_collection,
          biennale: answers.biennale,
          museum_exhibition: answers.museum_exhibition,
          art_fair: answers.art_fair,
        });
        setDocumentation({
          socials: {
            instagram: data.documentation.socials.instagram,
            twitter: data.documentation.socials.twitter,
            facebook: data.documentation.socials.facebook,
            linkedin: data.documentation.socials.linkedin,
          },
          cv: data.documentation.cv,
        });
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
          style={{
            width: 300,
            height: 300,
          }}
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

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Edit Credentials" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pt-[40px] pb-[150px]`}
      >
        <View
          style={tw.style(`bg-[#fff] border border-[#E7E7E7] rounded-[23px] p-[20px]`, {
            marginHorizontal: width / 18,
          })}
        >
          {/* Onboarding Questions */}
          {Object.entries(onboardingQuestions)
            .filter(([_, value]) => typeof value === 'string' && value.trim() !== '')
            .map(([key, value]) => {
              const questionText = questions.find((q) => q.key === key)?.text || key;
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

          {/* Socials */}
          {Object.entries(documentation.socials)
            .filter(([_, value]) => value.trim() !== '')
            .map(([key, value]) => (
              <OverviewContainer
                key={key}
                index={key}
                title={key.toUpperCase()}
                data={value}
                open={openSections[key]}
                setOpen={() => toggleSection(key)}
                openModal={() => openEditModal('social', key)}
              />
            ))}

          {/* CV */}
          {documentation.cv && (
            <OverviewContainer
              index={'CV Document'}
              title="CV Document"
              data={cv?.assets ? cv.assets[0].name : documentation.cv}
              open={openSections['cv']}
              setOpen={() => toggleSection('cv')}
              openModal={() => openEditModal('cv')}
            />
          )}
        </View>
      </ScrollView>
      <View style={tw`left-[30px] right-[30px] bottom-[40px] absolute`}>
        <LongBlackButton
          value="Save"
          onClick={() => {}}
          isLoading={false}
          //   isDisabled={checkIsDisabled()}
        />
      </View>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <Pressable
          onPressOut={() => setIsEditModalVisible(false)}
          style={tw`flex-1 bg-[#0003] justify-center items-center`}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={tw.style(
              (editingQuestionKey === 'social' || editingQuestionKey === 'cv') &&
                `bg-white p-5 rounded-lg w-[90%]`,
            )}
          >
            {editingQuestionKey === 'cv' ? (
              <>
                <TouchableOpacity
                  onPress={pickDocument}
                  style={tw.style(
                    `border border-[#00000033] bg-[#EAE8E8] h-[160px] rounded-[5px] justify-center items-center`,
                  )}
                >
                  {!cv?.assets && <SvgXml xml={uploadIcon} />}
                  <Text
                    style={tw`text-[12px] text-[#1A1A1A]000] font-medium mt-[15px] text-center mx-[30px]`}
                  >
                    {cv?.assets ? cv.assets[0].name : documentation.cv}
                  </Text>
                </TouchableOpacity>
              </>
            ) : editingQuestionKey === 'social' && editingSocialKey ? (
              <>
                <Text style={tw`text-[16px] text-[#1A1A1A] font-medium text-center mb-4`}>
                  Edit {editingSocialKey.toUpperCase()}
                </Text>
                <TextInput
                  style={tw`bg-[#F7F7F7] rounded-[20px] h-[50px] p-4 mx-[10px]`}
                  placeholder={`Enter your ${editingSocialKey} link`}
                  value={
                    documentation.socials[editingSocialKey as keyof typeof documentation.socials]
                  }
                  onChangeText={(text) => {
                    setDocumentation((prev) => ({
                      ...prev,
                      socials: {
                        ...prev.socials,
                        [editingSocialKey]: text,
                      },
                    }));
                  }}
                />
              </>
            ) : editingQuestionKey ? (
              (() => {
                const questionDetails = questions.find((q) => q.key === editingQuestionKey);
                return (
                  <QuestionContainer
                    question={questionDetails?.text || ''}
                    value={onboardingQuestions[editingQuestionKey as QuestionKey] || ''}
                    onSelect={(answer) => {
                      setOnboardingQuestions((prev) => ({
                        ...prev,
                        [editingQuestionKey]: answer,
                      }));
                    }}
                    animatedStyle={{}}
                    isModalVisible={isEditModalVisible}
                    options={questionDetails?.options}
                    isNumber={questionDetails?.isNumber}
                  />
                );
              })()
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
