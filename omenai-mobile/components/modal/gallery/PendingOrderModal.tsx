import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CloseButton from 'components/buttons/CloseButton'
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import LongBlackButton from 'components/buttons/LongBlackButton';

export default function PendingOrderModal() {
    const {setIsVisible, setModalType} = galleryOrderModalStore();

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{fontSize: 16, flex: 1}}>Pending order</Text>
                <CloseButton handlePress={() => setIsVisible(false)} />
            </View>
            <View style={{gap: 20, marginTop: 30}}>
                <LongWhiteButton 
                    onClick={() => setModalType('decline')} 
                    value='Decline order'
                />
                <LongBlackButton
                    onClick={() => setModalType('accept')} 
                    value='Accept order'
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})