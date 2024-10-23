import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons';
import { courselImages } from '../../../../constants/images.constants';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';

export default function Coursel() {
    const translateX = useSharedValue(0);

    const [selected, setSelected] = useState(0);

    const handleClick = (typeOf: 'forward' | 'backward') => {
        if (typeOf === 'backward' && selected < 1) return;
        if (typeOf === 'forward' && selected === courselImages.length - 1) return;

        

        setSelected(prev => (typeOf === 'backward' ? prev - 1 : prev + 1));
    }


    return (
        <View style={styles.container}>
            <View style={styles.courselContainer}>
                <View style={styles.courselImages}>
                    {courselImages.map((i, idx) => (
                        <Animated.View
                            key={idx}
                            style={
                                idx === selected ? {
                                height: '100%',
                                width: '100%',
                                transform: [{translateX: translateX}]
                            } : {display: 'none'}}
                        >
                            <Image
                                source={i}
                                style={styles.image}
                            />
                        </Animated.View>
                    ))}
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleClick('backward')}>
                        <View style={styles.toggleButtons}><Feather name='chevron-left' size={25} color={colors.white} /></View>
                    </TouchableOpacity>
                    <View style={{flex: 1}} />
                    <TouchableOpacity onPress={() => handleClick('forward')}>
                        <View style={styles.toggleButtons}><Feather name='chevron-right' size={25} color={colors.white} /></View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.indicators}>
                {courselImages.map((_, idx) => (
                    <View 
                        style={[styles.indicatorItem, idx === selected && {backgroundColor: colors.primary_black}]} 
                        key={idx}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        borderBottomWidth: 1,
        borderColor: '#ebebeb',
        paddingBottom: 20
    },
    courselContainer: {
        height: 350,
        position: 'relative',
    },
    courselImages: {
        flex: 1,
        backgroundColor: colors.inputLabel,
        flexDirection: 'row'
    },
    image: {
        height: '100%',
        width: '100%',
    },
    buttonsContainer: {
        position: 'absolute',
        width: '100%',
        height: 60,
        top: '40%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButtons: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white60
    },
    indicators: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    indicatorItem: {
        height: 8,
        width: 8,
        borderRadius: 5,
        backgroundColor: '#ebebeb'
    }
})