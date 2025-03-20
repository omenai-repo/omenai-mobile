import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import { QuestionKey } from "./ArtistOnboarding";
import tw from "twrnc";
import { TextInput } from "react-native";
import { Animated } from "react-native";

const QuestionContainer = ({
  question,
  value,
  onSelect,
  animatedStyle,
  questionKey,
  isModalVisible,
}: {
  question: string;
  value: string;
  onSelect: (answer: string) => void;
  animatedStyle: any;
  questionKey: QuestionKey;
  isModalVisible?: boolean;
}) => {
  const { width } = useWindowDimensions();
  return (
    <Animated.View
      style={[
        tw`border border-[#BDBDBDB2] rounded-[16px] py-[25px] self-center`,
        {
          width: width - 50,
          backgroundColor: isModalVisible ? "#ffff" : "#FFFFFFB5",
        },
        animatedStyle,
      ]}
    >
      <Text
        style={tw`text-[16px] text-[#1A1A1A] font-medium text-center px-[50px]`}
      >
        {question}
      </Text>
      <View style={tw`h-[1px] bg-[#00000033] my-[20px] mx-[40px]`} />

      {/* Conditional Input for Bio, Solo, and Group */}
      {questionKey === "bio" ||
      questionKey === "solo" ||
      questionKey === "group" ? (
        <>
          <TextInput
            style={tw.style(
              `bg-[#F7F7F7] rounded-[20px] pt-[20px] pl-[20px] mx-[30px]`,
              questionKey === "solo" || questionKey === "group"
                ? "py-[15px]"
                : "h-[97px]",
              {
                textAlignVertical: "top",
              }
            )}
            multiline={questionKey === "bio"}
            keyboardType={
              questionKey === "solo" || questionKey === "group"
                ? "numeric"
                : "default"
            }
            placeholder={
              questionKey === "bio" ? "Write about yourself..." : "Enter number"
            }
            value={value}
            onChangeText={onSelect}
          />
          {questionKey === "bio" &&
            (() => {
              const wordCount = value
                .trim()
                .split(/\s+/)
                .filter((word) => word !== "").length;
              const isLimitExceeded = wordCount > 250;

              return (
                <View>
                  <Text
                    style={tw.style(
                      `text-[12px] text-right mr-[30px] mt-[5px]`,
                      isLimitExceeded ? "text-[#FF0000]" : "text-[#00000080]"
                    )}
                  >
                    {wordCount}/250 words
                  </Text>

                  {/* Warning Message */}
                  {isLimitExceeded && (
                    <Text
                      style={tw`text-[12px] text-[#FF0000] text-center mt-[5px]`}
                    >
                      You have exceeded the word limit!
                    </Text>
                  )}
                </View>
              );
            })()}
        </>
      ) : questionKey === "biennale" ? ( // Updated: Special handling for Biennale
        <View>
          {["Venice Biennale", "Others", "None"].map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={tw.style(
                `py-[10px] justify-center items-center rounded-[20px] mx-[35px]`,
                value === option && "bg-[#1A1A1A]"
              )}
            >
              <Text
                style={tw.style(
                  `text-[16px]`,
                  value === option && "text-[#FFFFFF]"
                )}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        // Yes/No Buttons for other questions
        <View>
          <Pressable
            onPress={() => onSelect("yes")}
            style={tw.style(
              `py-[10px] justify-center items-center rounded-[20px] mx-[35px]`,
              value === "yes" && "bg-[#1A1A1A]"
            )}
          >
            <Text
              style={tw.style(
                `text-[16px]`,
                value === "yes" && "text-[#FFFFFF]"
              )}
            >
              Yes
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onSelect("no")}
            style={tw.style(
              `py-[10px] justify-center items-center rounded-[20px] mx-[35px]`,
              value === "no" && "bg-[#1A1A1A]"
            )}
          >
            <Text
              style={tw.style(
                `text-[16px]`,
                value === "no" && "text-[#FFFFFF]"
              )}
            >
              No
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

export default QuestionContainer;
