import { Text, TextStyle, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import loaderAnimation from 'assets/other/loader-animation.json';

type FittedBlackButtonProps = {
  value: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  height?: number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string | TextStyle['fontWeight'];
  disabledBgColor?: string;
  disabledTextColor?: string;
};

export default function FittedBlackButton({
  value,
  isDisabled = false,
  onClick,
  isLoading = false,
  children,
  height = 45,
  bgColor = '#000000',
  textColor = '#FFFFFF',
  fontSize = 16,
  fontWeight = '400',
  disabledBgColor = '#E0E0E0',
  disabledTextColor = '#A1A1A1',
}: FittedBlackButtonProps) {
  const animation = useRef(null);

  const backgroundColor = isDisabled || isLoading ? disabledBgColor : bgColor;
  
  const containerStyle = [
    tw`flex flex-row items-center justify-center rounded-[91px] gap-[10px] px-5`,
    { height, backgroundColor },
  ];

  const textStyle = {
    color: isDisabled ? disabledTextColor : textColor,
    fontSize,
    fontWeight: fontWeight as TextStyle['fontWeight'],
  };

  if (isDisabled || isLoading) {
    return (
      <View style={containerStyle}>
        {isDisabled ? (
          <>
            <Text style={textStyle}>{value}</Text>
            {children}
          </>
        ) : (
          <LottieView
            autoPlay
            ref={animation}
            style={tw`w-[100px] h-[100px]`}
            source={loaderAnimation}
          />
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} style={containerStyle} onPress={onClick}>
      <Text style={textStyle}>{value}</Text>
      {children}
    </TouchableOpacity>
  );
}
