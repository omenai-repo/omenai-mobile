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
  isModalVisible,
  options,
  isNumber,
}: {
  question: string;
  value: string;
  onSelect: (answer: string) => void;
  animatedStyle: any;
  isModalVisible?: boolean;
  options?: string[];
  isNumber?: boolean;
}) => {
  const { width } = useWindowDimensions();
  return (
    <Animated.View
      style={[
        tw`border border-[#BDBDBDB2] rounded-md py-[25px] self-center`,
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
      {options ? (
        // Updated: Special handling for Biennale
        <View>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={tw.style(
                `py-[10px] justify-center items-center rounded-md mx-[35px]`,
                value === option && "bg-[#1A1A1A]",
              )}
            >
              <Text
                style={tw.style(
                  `text-[16px]`,
                  value === option && "text-[#FFFFFF]",
                )}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <>
          <TextInput
            style={tw.style(
              `bg-[#F7F7F7] rounded-md pt-[20px] pl-[20px] mx-[30px]`,
              isNumber ? "py-[15px]" : "h-[97px]",
              {
                textAlignVertical: "top",
              },
            )}
            multiline={!isNumber}
            keyboardType={isNumber ? "numeric" : "default"}
            placeholder={isNumber ? "Enter number" : "Write about yourself..."}
            value={value}
            onChangeText={(text) => {
              if (!isNumber) {
                // Count words
                const wordCount = text
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word !== "").length;

                // Allow text input only if word count is within the limit
                if (wordCount <= 250) {
                  onSelect(text);
                }
              } else {
                // If it's a number input, update as usual
                onSelect(text);
              }
            }}
          />
          {!isNumber &&
            (() => {
              const wordCount = value
                .trim()
                .split(/\s+/)
                .filter((word) => word !== "").length;
              const isLimitExceeded = wordCount > 249;

              return (
                <View>
                  <Text
                    style={tw.style(
                      `text-[12px] text-right mr-[30px] mt-[5px]`,
                      isLimitExceeded
                        ? "text-[#FF0000]"
                        : "text-[#1A1A1A]00080]",
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
      )}
    </Animated.View>
  );
};

export default QuestionContainer;
