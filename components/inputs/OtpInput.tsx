import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { useOtpInput } from '../../hooks/useOtpInput';
import VerticalStick from './VerticalStick';
import type { OtpInputProps, OtpInputRef } from '../../types/otp';

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>((props, ref) => {
  const {
    models: { text, inputRef, focusedInputIndex, isFocused, placeholder },
    actions: { clear, handlePress, handleTextChange, focus, handleFocus, handleBlur, blur },
    forms: { setTextWithRef },
  } = useOtpInput(props);
  
  const {
    disabled,
    numberOfDigits = 6,
    autoFocus = true,
    hideStick,
    focusColor = '#A4D0A4',
    focusStickBlinkingDuration,
    secureTextEntry = false,
    secureTextEntryDelay,
    theme = {},
    textInputProps,
    textProps,
    type = 'numeric',
  } = props;
  
  const {
    containerStyle,
    inputsContainerStyle,
    pinCodeContainerStyle,
    pinCodeTextStyle,
    focusStickStyle,
    focusedPinCodeContainerStyle,
    filledPinCodeContainerStyle,
    disabledPinCodeContainerStyle,
    placeholderTextStyle,
  } = theme;

  const [lastTypedIndex, setLastTypedIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTextRef = useRef(text);

  const baseContainerStyle = tw`w-14 h-14 border border-gray-400 rounded-[15px] bg-white flex items-center justify-center`;

  useImperativeHandle(ref, () => ({ clear, focus, setValue: setTextWithRef, blur }));

  useEffect(() => {
    if (!secureTextEntry || !secureTextEntryDelay) return;

    if (text.length > prevTextRef.current.length) {
      const newCharIndex = text.length - 1;
      if (timerRef.current) clearTimeout(timerRef.current);
      setLastTypedIndex(newCharIndex);
      timerRef.current = setTimeout(() => {
        setLastTypedIndex(null);
        timerRef.current = null;
      }, secureTextEntryDelay);
    }
    prevTextRef.current = text;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, secureTextEntry, secureTextEntryDelay]);

  useEffect(() => {
    if (!secureTextEntry) {
      setLastTypedIndex(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [secureTextEntry]);

  const generatePinCodeContainerStyle = (isFocusedContainer: boolean, char: string) => {
    const stylesArray = [baseContainerStyle, pinCodeContainerStyle];
    
    if (focusColor && isFocusedContainer) {
      stylesArray.push({ borderColor: focusColor });
    }
    if (focusedPinCodeContainerStyle && isFocusedContainer) {
      stylesArray.push(focusedPinCodeContainerStyle);
    }
    if (filledPinCodeContainerStyle && Boolean(char)) {
      stylesArray.push(filledPinCodeContainerStyle);
    }
    if (disabledPinCodeContainerStyle && disabled) {
      stylesArray.push(disabledPinCodeContainerStyle);
    }
    
    return stylesArray;
  };

  const placeholderStyle = {
    opacity: placeholder ? 0.5 : pinCodeTextStyle?.opacity || 1,
    ...(placeholder ? placeholderTextStyle : {}),
  };

  return (
    <View style={[tw`flex-row justify-between gap-2`, containerStyle, inputsContainerStyle]}>
      {new Array(numberOfDigits).fill(0).map((_, index) => {
        const isPlaceholderCell = placeholder && !text?.[index];
        const char = isPlaceholderCell ? placeholder?.[index] || ' ' : text[index];
        const isFocusedInput = index === focusedInputIndex && !disabled && isFocused;
        const isFilledLastInput = text.length === numberOfDigits && index === text.length - 1;
        const isFocusedContainer = isFocusedInput || (isFilledLastInput && isFocused);
        const isMasked = secureTextEntry && index !== lastTypedIndex;

        return (
          <Pressable
            key={`otp-${index}`}
            disabled={disabled}
            onPress={handlePress}
            style={generatePinCodeContainerStyle(isFocusedContainer, char)}
            testID="otp-input"
            accessibilityRole="button"
            accessibilityLabel={`PIN digit ${index + 1}`}
          >
            {isFocusedInput && !hideStick ? (
              <VerticalStick
                focusColor={focusColor}
                style={focusStickStyle}
                focusStickBlinkingDuration={focusStickBlinkingDuration}
              />
            ) : (
              <Text
                {...textProps}
                style={[
                  tw`text-lg text-center`,
                  pinCodeTextStyle,
                  isPlaceholderCell ? placeholderStyle : {},
                  textProps?.style,
                ]}
              >
                {char && isMasked ? '•' : char}
              </Text>
            )}
          </Pressable>
        );
      })}
      <TextInput
        {...textInputProps}
        value={text}
        onChangeText={handleTextChange}
        maxLength={numberOfDigits}
        keyboardType={type === 'numeric' ? 'number-pad' : 'default'}
        textContentType="oneTimeCode"
        ref={inputRef}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        editable={!disabled}
        caretHidden={true}
        testID="otp-input-hidden"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          tw`absolute opacity-0 w-full h-full`,
          textInputProps?.style,
        ]}
      />
    </View>
  );
});

OtpInput.displayName = 'OtpInput';

export default OtpInput;
