import type { ColorValue, ViewStyle, TextStyle, TextInputProps, TextProps } from 'react-native';

export interface OtpInputProps {
  numberOfDigits?: number;
  autoFocus?: boolean;
  focusColor?: ColorValue;
  onTextChange?: (text: string) => void;
  onFilled?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  blurOnFilled?: boolean;
  hideStick?: boolean;
  focusStickBlinkingDuration?: number;
  secureTextEntry?: boolean;
  secureTextEntryDelay?: number;
  theme?: OtpTheme;
  disabled?: boolean;
  textInputProps?: TextInputProps;
  textProps?: TextProps;
  type?: 'alpha' | 'numeric' | 'alphanumeric' | 'text';
  placeholder?: string;
}

export interface OtpInputRef {
  clear: () => void;
  focus: () => void;
  setValue: (value: string) => void;
  blur: () => void;
}

export interface OtpTheme {
  containerStyle?: ViewStyle;
  inputsContainerStyle?: ViewStyle;
  pinCodeContainerStyle?: ViewStyle;
  filledPinCodeContainerStyle?: ViewStyle;
  pinCodeTextStyle?: TextStyle;
  focusStickStyle?: ViewStyle;
  focusedPinCodeContainerStyle?: ViewStyle;
  disabledPinCodeContainerStyle?: ViewStyle;
  placeholderTextStyle?: TextStyle;
}

export interface VerticalStickProps {
  focusColor?: ColorValue;
  style?: ViewStyle;
  focusStickBlinkingDuration?: number;
}

export type OtpInputType = 'alpha' | 'numeric' | 'alphanumeric' | 'text';
