import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import LongBlackButton from 'components/buttons/LongBlackButton';
import Input from 'components/inputs/Input';
import CloseButton from 'components/buttons/CloseButton';
import { declineOrderRequest } from 'services/orders/declineOrderRequest';
import CompletedModal from './CompletedModal';

export default function DeclineOrderModal() {
  const { declineForm, updateDeclineForm, currentId, clear } = galleryOrderModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDecline = async () => {
    setIsLoading(true);
    let data: OrderAcceptedStatusTypes = {
      status: 'declined',
      reason: declineForm.reason,
    };

    const results = await declineOrderRequest({ data: data, order_id: currentId });

    if (results.isOk) {
      setCompleted(true);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Decline order</Text>
        <CloseButton handlePress={clear} />
      </View>
      <View style={{ marginBottom: 40, marginTop: 20 }}>
        {completed ? (
          <CompletedModal placeholder="Order declined successfully" />
        ) : (
          <Input
            label="Reason"
            placeHolder="Enter a reason for declining order"
            onInputChange={(e) => updateDeclineForm('reason', e)}
            value={declineForm.reason}
          />
        )}
      </View>
      {completed ? (
        <LongBlackButton value="Dismiss" onClick={clear} />
      ) : (
        <LongBlackButton
          value={isLoading ? 'Loading...' : 'Decline order'}
          onClick={handleDecline}
          isDisabled={declineForm.reason.length < 1 || isLoading}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
