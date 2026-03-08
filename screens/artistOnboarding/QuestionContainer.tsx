import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import tw from "twrnc";
import { TextInput } from "react-native";
import { Animated } from "react-native";
import { colors } from "#config/colors.config";

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
        tw`border border-neutral-200 rounded-md py-8 self-center px-6`,
        {
          width: width - 50,
          backgroundColor: isModalVisible ? "#ffff" : "#FFFFFFB5",
        },
        animatedStyle,
      ]}
    >
      <Text style={tw`text-sm text-[#1A1A1A] text-center font-sans-regular 1`}>
        {question}
      </Text>
      <View style={tw`h-[1px] bg-neutral-200 my-5`} />

      {/* Conditional Input for Bio, Solo, and Group */}
      {options ? (
        // Updated: Special handling for Biennale
        <View>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={tw.style(
                `py-3.5 justify-center items-center rounded-md mb-4 border`,
                value === option
                  ? `bg-[${colors.black}] border-[${colors.black}]`
                  : "bg-transparent border-neutral-100",
              )}
            >
              <Text
                style={tw.style(
                  `text-sm font-sans-regular`,
                  value === option ? "text-white" : "text-[#1A1A1A]",
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
              `bg-neutral-100 rounded-md p-5 text-sm font-sans-regular`,
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
                // Allow text input only if character count is within the limit
                if (text.length <= 500) {
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
              const charCount = value.length;
              const isLimitExceeded = charCount >= 500;

              return (
                <View>
                  <Text
                    style={tw.style(
                      `text-sm text-right font-sans-regular mt-1.5`,
                      isLimitExceeded
                        ? "text-red-600"
                        : `text-[${colors.black}]`,
                    )}
                  >
                    {charCount}/500 Characters
                  </Text>

                  {/* Warning Message */}
                  {isLimitExceeded && (
                    <Text
                      style={tw`text-sm text-red-600 text-center mt-1.5 font-sans-regular`}
                    >
                      You have reached the character limit!
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
