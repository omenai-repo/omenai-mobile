import React from 'react';
import { View } from 'react-native';
import Input from 'components/inputs/Input';

interface DimensionInputProps {
  field: string;
  unit: string;
  value: string;
  errorMessage: string;
  onInputChange: (text: string) => void;
  onValidation: (text: string) => void;
}

const DimensionInput: React.FC<DimensionInputProps> = ({
  field,
  unit,
  value,
  errorMessage,
  onInputChange,
  onValidation
}) => (
  <View>
    <Input
      label={`${field.charAt(0).toUpperCase() + field.slice(1)} (${unit})`}
      keyboardType="numeric"
      onInputChange={(text) => {
        onInputChange(text);
        onValidation(text);
      }}
      placeHolder={`Enter ${field}`}
      value={value}
      errorMessage={errorMessage}
    />
  </View>
);

export default DimensionInput;
