import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { galleryOrderModalStore } from 'store/modal/galleryModalStore'
import LongBlackButton from 'components/buttons/LongBlackButton';
import Input from 'components/inputs/Input';
import CloseButton from 'components/buttons/CloseButton';
import { declineOrderRequest } from 'services/orders/declineOrderRequest';

export default function DeclineOrderModal() {
    const {declineForm, updateDeclineForm, setIsVisible, currentId, clear} = galleryOrderModalStore();
    const [isLoading, setIsLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleModalClose = () => {
        // setIsVisible(false);
        clear()
    }

    const handleDecline = async () => {
        setIsLoading(true);
        let data : OrderAcceptedStatusTypes = {
            status: 'declined',
            reason: declineForm.reason
        };

        // console.log(currentId);
        
        const results = await declineOrderRequest({data: data, order_id: currentId})

        if(results.isOk){
            setCompleted(true)
            console.log(results)
        }else{
            console.log(results)
        }

        setIsLoading(false);

    }

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{fontSize: 16, flex: 1}}>Decline order</Text>
                <CloseButton handlePress={handleModalClose} />
            </View>
            <View style={{marginBottom: 40, marginTop: 20}}>
                <Input
                    label='Reason'
                    placeHolder='Enter a reason for declining order'
                    onInputChange={e => updateDeclineForm('reason', e)}
                    value={declineForm.reason}
                />
            </View>
            <LongBlackButton
                value={isLoading ? 'Loading...' : 'Decline order'}
                onClick={handleDecline}
                isDisabled={declineForm.reason.length < 1 || isLoading}
                isLoading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({})