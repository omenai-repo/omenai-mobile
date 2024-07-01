import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { galleryOrderModalStore } from 'store/modal/galleryModalStore'
import LongBlackButton from 'components/buttons/LongBlackButton';
import Input from 'components/inputs/Input';
import CloseButton from 'components/buttons/CloseButton';

export default function DeclineOrderModal() {
    const {declineForm, updateDeclineForm, setIsVisible} = galleryOrderModalStore();

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{fontSize: 16, flex: 1}}>Decline order</Text>
                <CloseButton handlePress={() => setIsVisible(false)} />
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
                value='Decline order'
                onClick={() => console.log('')}
            />
        </View>
    )
}

const styles = StyleSheet.create({})