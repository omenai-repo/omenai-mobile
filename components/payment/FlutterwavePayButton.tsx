import LongBlackButton from "#components/buttons/LongBlackButton";

export type FlutterwavePayButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const FlutterwavePayButton = ({
  onPress,
  disabled,
  isLoading,
}: FlutterwavePayButtonProps) => (
  <LongBlackButton
    value="Pay with flutterwave"
    onClick={onPress}
    isDisabled={disabled}
    isLoading={isLoading}
  />
);

export default FlutterwavePayButton;
