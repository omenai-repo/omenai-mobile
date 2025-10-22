import { StyleSheet, Text, View } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { Fontisto } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { generateAlphaDigit } from 'utils/utils_generateToken';
import { utils_hasEmptyString } from 'utils/utils_hasEmptyString';
import { useAppStore } from 'store/app/appStore';
import { initiateDirectCharge } from 'services/subscriptions/subscribeUser/initiateDirectCharge';
import { useModalStore } from 'store/modal/modalStore';
import { apiUrl } from 'constants/apiUrl.constants';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import CardNumberInput from '../../../screens/checkout/components/inputs/CardNumberInput';
import { screenName } from 'constants/screenNames.constants';

type cardInfoProps = {
  name: string;
  cardNumber: string;
  expiryMonth: string;
  year: string;
  cvv: string;
};

type CardInfoProps = {
  handleNext: () => void;
  plan?: PlanProps;
  updateAuthorization: Dispatch<SetStateAction<'redirect' | 'avs_noauth' | 'pin' | 'otp' | ''>>;
  updateCard: boolean;
};

export default function CardInfo({
  handleNext,
  plan,
  updateAuthorization,
  updateCard,
}: CardInfoProps) {
  const routes = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const params = routes.params as { tab?: string };

  const { update_flw_charge_payload_data, setWebViewUrl, set_transaction_id } =
    subscriptionStepperStore();

  const [cardInfo, setCardInfo] = useState<cardInfoProps>({
    name: '',
    cardNumber: '',
    expiryMonth: '',
    year: '',
    cvv: '',
  });
  const [cardInputLoading, setCardInputLoading] = useState(false);

  const handleCardSubmit = async () => {
    setCardInputLoading(true);
    const ref = generateAlphaDigit(7);
    if (utils_hasEmptyString(cardInfo)) {
      //throw error
      updateModal({
        message: 'Make sure all input fields are filled',
        modalType: 'error',
        showModal: true,
      });
    } else {
      const parsedCardNumber = cardInfo.cardNumber.replace(/ /g, '');

      let customer: {
        name: string;
        email: string;
        gallery_id: string;
        plan_id?: string;
        plan_interval?: string;
      } = {
        name: userSession.name,
        email: userSession.email,
        gallery_id: userSession.id,
      };

      if (!updateCard && plan) {
        customer = {
          name: userSession.name,
          email: userSession.email,
          gallery_id: userSession.id,
          plan_id: plan._id,
          plan_interval: params?.tab,
        };
      }
      const data: FLWDirectChargeDataTypes & { name: string } = {
        name: cardInfo.name,
        cvv: cardInfo.cvv,
        card: parsedCardNumber,
        month: cardInfo.expiryMonth,
        year: cardInfo.year.slice(2, 4),
        tx_ref: ref,
        amount: updateCard
          ? '1'
          : params?.tab === 'monthly'
          ? plan?.pricing.monthly_price
          : plan?.pricing.annual_price,
        customer,
        redirect: `${apiUrl}/dashboard/gallery/billing`,
        charge_type: updateCard ? 'card_change' : null,
      };

      const response = await initiateDirectCharge(data);
      setCardInputLoading(false);
      if (response?.isOk) {
        if (response.data.status === 'error') {
          console.log(response.data);
          updateModal({
            message: response.data.message,
            showModal: true,
            modalType: 'error',
          });
        } else {
          if (response?.data?.data?.status === 'successful') {
            set_transaction_id(response.data.data.id);
            navigation.navigate(screenName.verifyTransaction);
          } else {
            if (response.data.meta.authorization.mode === 'redirect') {
              set_transaction_id(response.data.data.id);
              setWebViewUrl(response.data.meta.authorization.redirect);
            } else {
              updateAuthorization(response.data.meta.authorization.mode);
            }
            handleNext();
          }
        }
        update_flw_charge_payload_data(data);
      } else {
        updateModal({
          message: 'Something went wrong',
          showModal: true,
          modalType: 'error',
        });
      }
    }

    setCardInputLoading(false);
  };

  return (
    <View
      style={{
        paddingBottom: 100,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Payment Method</Text>
        <View style={styles.secureForm}>
          <Fontisto name="locked" size={10} />
          <Text style={{ fontSize: 12, color: colors.primary_black }}>Secure form</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Input
          label="Card name"
          onInputChange={(e) => setCardInfo((prev) => ({ ...prev, name: e }))}
          value={cardInfo.name}
          placeHolder="Enter the name on your card"
        />
        {/* <Input
                    label='Card number'
                    onInputChange={e => setCardInfo(prev => ({...prev, cardNumber: e}))}
                    value={cardInfo.cardNumber}
                    placeHolder='Enter the card number'
                    keyboardType="number-pad"
                /> */}
        <CardNumberInput onChange={(e) => setCardInfo((prev) => ({ ...prev, cardNumber: e }))} />
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Expiry month"
              onInputChange={(e) => setCardInfo((prev) => ({ ...prev, expiryMonth: e }))}
              value={cardInfo.expiryMonth}
              placeHolder="MM"
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Expiry year"
              onInputChange={(e) => setCardInfo((prev) => ({ ...prev, year: e }))}
              value={cardInfo.year}
              placeHolder="YYYY"
              keyboardType="number-pad"
            />
          </View>
        </View>
        <Input
          label="CVV"
          onInputChange={(e) => setCardInfo((prev) => ({ ...prev, cvv: e }))}
          value={cardInfo.cvv}
          placeHolder="Enter the CVV number"
          keyboardType="number-pad"
        />
      </View>
      <LongBlackButton onClick={handleCardSubmit} value="Submit" isLoading={cardInputLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  secureForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
