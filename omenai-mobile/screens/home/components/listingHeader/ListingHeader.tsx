import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { colors } from '../../../../config/colors.config'
import { useHomeStore } from 'store/home/homeStore'

export default function ListingHeader() {
    const { setShowSelectModal, showSelectModal, listingType } = useHomeStore();

    return (
        <View style={styles.container}>
            <View style={{flex: 1, position: 'relative', zIndex: 200}}>
                <TouchableOpacity style={{flexWrap: 'wrap'}} onPress={() => setShowSelectModal(!showSelectModal)}>
                    <View style={styles.selectButton}>
                        <Text style={{fontSize: 14, color: colors.white, textTransform: 'capitalize'}}>{listingType} Artworks</Text>
                        <Feather name='chevron-down' color={colors.white} size={18} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
                <TouchableOpacity>
                    <View style={styles.seeMoreButton}>
                        <Text style={{fontSize: 14, color: colors.primary_black}}>See more</Text>
                        <Feather name='arrow-right' color={colors.primary_black} size={18} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 40
    },
    selectButton: {
        height: 50,
        backgroundColor: colors.primary_black,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 30,
        gap: 10,
    },
    seeMoreButton: {
        height: 50,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 30,
        gap: 10
    },
    
})