import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CloseButton from 'components/buttons/CloseButton'
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { colors } from 'config/colors.config';

export default function PendingOrderModal() {
    const {setIsVisible, setModalType, artworkDetails, clear} = galleryOrderModalStore();

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{fontSize: 16, flex: 1}}>Pending order</Text>
                <CloseButton handlePress={clear} />
            </View>
            {artworkDetails &&
                <View style={styles.artworkDetailsContainer}>
                    {artworkDetails.map((detail, index) => (
                        <View key={index}>
                            <Text style={{fontSize: 14, color: '#858585'}}>{detail.label}</Text>
                            <Text style={{fontSize: 14, color: colors.primary_black, marginTop: 4}}>{detail.value}</Text>
                        </View>
                    ))}
                </View>
            }
            <View style={{gap: 20, marginTop: 30}}>
                <LongWhiteButton 
                    onClick={() => setModalType('decline')} 
                    value='Decline order'
                />
                <LongBlackButton
                    onClick={() => setModalType('accept')} 
                    value='Provide shipping quote'
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    artworkDetailsContainer: {
        borderWidth: 1,
        borderColor: colors.grey50,
        marginTop: 20,
        padding: 10,
        borderRadius: 7,
        gap: 13
    }
})