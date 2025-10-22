import { useState, useRef, useMemo } from 'react';
import type { OtpInputProps } from '../types/otp';

const regexMap = {
  alpha: /[^a-zA-Z]/g,
  numeric: /[^\d]/g,
  alphanumeric: /[^a-zA-Z\d]/g,
  text: /[^\w\s]/g,
};

export const useOtpInput = (props: OtpInputProps) => {
  const {
    onTextChange,
    onFilled,
    numberOfDigits = 6,
    disabled,
    blurOnFilled,
    type,
    onFocus,
    onBlur,
    placeholder: _placeholder,
  } = props;
  
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);
  const focusedInputIndex = text.length;
  
  const placeholder = useMemo(
    () => (_placeholder?.length === 1 ? _placeholder.repeat(numberOfDigits) : _placeholder),
    [_placeholder, numberOfDigits]
  );

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleTextChange = (value: string) => {
    if (disabled) return;
    const sanitizedValue = type && regexMap[type] ? value.replace(regexMap[type], '') : value;
    if (sanitizedValue.length <= numberOfDigits) {
      setText(sanitizedValue);
      onTextChange?.(sanitizedValue);
      if (sanitizedValue.length === numberOfDigits) {
        onFilled?.(sanitizedValue);
        blurOnFilled && inputRef.current?.blur();
      }
    }
  };

  const setTextWithRef = (value: string) => {
    const normalizedValue = value.length > numberOfDigits ? value.slice(0, numberOfDigits) : value;
    handleTextChange(normalizedValue);
  };

  const clear = () => setText('');
  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();
  
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return {
    models: { text, inputRef, focusedInputIndex, isFocused, placeholder },
    actions: { handlePress, handleTextChange, clear, focus, blur, handleFocus, handleBlur },
    forms: { setTextWithRef },
  };
};
