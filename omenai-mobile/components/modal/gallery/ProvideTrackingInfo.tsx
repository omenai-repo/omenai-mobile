import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { galleryOrderModalStore } from 'store/modal/galleryModalStore'
import LongBlackButton from 'components/buttons/LongBlackButton';
import Input from 'components/inputs/Input';
import CloseButton from 'components/buttons/CloseButton';
import { declineOrderRequest } from 'services/orders/declineOrderRequest';
import CompletedModal from './CompletedModal';

export default function ProvideTrackingInfo() {
    const {clear} = galleryOrderModalStore();
    const [isLoading, setIsLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        setIsLoading(false);

    }

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{fontSize: 16, flex: 1}}>Tracking Information</Text>
                <CloseButton handlePress={clear} />
            </View>
            <View style={{marginBottom: 40, marginTop: 20}}>
                {completed ? 
                    <CompletedModal placeholder='Order declined successfully'  /> 
                    :
                    <View style={{gap: 20}}>
                        <Input
                            label='Package tracking link'
                            placeHolder='Please provide tracking link for this order'
                            onInputChange={e => console.log('reason', e)}
                            value=''
                        />
                        <Input
                            label='Tracking ID'
                            placeHolder='Please provide tracking ID for this package'
                            onInputChange={e => console.log('reason', e)}
                            value=''
                        />
                    </View>
                }
            </View>
            {completed ? 
                <LongBlackButton value='Dismiss' onClick={clear} />
            :
                <LongBlackButton
                    value={isLoading ? 'Loading...' : 'Submit'}
                    onClick={handleSubmit}
                    isDisabled={false}
                    isLoading={isLoading}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({})