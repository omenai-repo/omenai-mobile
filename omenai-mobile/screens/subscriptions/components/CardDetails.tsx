import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import mastercardLogo from 'assets/icons/MastercardLogo.png';
import cardwifiIcon from 'assets/icons/cardwifiIcon.png';
import chip from 'assets/icons/chip.png';
import creditcardBG from 'assets/icons/creditcardBg.png';

export default function CardDetails() {
    const [showCardButtons, setShowCardButtons] = useState(true);

    const Button = ({label, remove}: {label: string, remove?: boolean}) => {
        return(
            <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
                <View style={styles.button}>
                    <Text style={{color: remove ? '#ff0000' : colors.primary_black}}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={{fontSize: 16, color: colors.primary_black, marginBottom: 10}}>Payment info</Text>
                <ImageBackground source={creditcardBG} resizeMode="cover" style={styles.cardContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        <Text style={styles.galleryName}>Fvture Gallery</Text>
                        <Image source={cardwifiIcon} />
                    </View>
                    <Image style={styles.chip} source={chip} />
                    <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'flex-end'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.cardNumber}>3701 92** **** 3643</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10}}>
                                <Text style={{fontSize: 13, color: colors.white, opacity: 0.7}}>Valid Thru</Text>
                                <Text style={styles.expiryYear}>08/24</Text>
                            </View>
                        </View>
                        <Image source={mastercardLogo} style={styles.cardLogo} />
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.bottomContainer}>
                <Button label='Update card' />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 10,
        marginBottom: 20
    },
    topContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        padding: 15
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems:'center',
        gap: 15,
    },
    button: {
        height: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 10
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey50
    },
    cardContainer: {
        padding: 20,
        backgroundColor: colors.primary_black,
        borderRadius: 10,
        overflow: 'hidden'
    },
    cardName: {
        fontSize: 14,
        color: colors.white,
        flex: 1,
        opacity: 0.9
    },
    cardNumber: {
        fontSize: 16,
        color: colors.white
    },
    galleryName: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 10,
        flex: 1
    },
    expiryYear: {
        color: colors.white,
        fontSize: 14,
        opacity: 0.9
    },
    cardLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    chip: {
        width: 45,
        resizeMode: 'contain',
        marginVertical: 20
    }
})