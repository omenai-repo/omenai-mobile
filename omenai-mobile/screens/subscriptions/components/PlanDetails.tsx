import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import LongWhiteButton from 'components/buttons/LongWhiteButton'
import LongBlackButton from 'components/buttons/LongBlackButton'
import FittedBlackButton from 'components/buttons/FittedBlackButton'
import { Feather } from '@expo/vector-icons'

export default function PlanDetails() {
    const [showCardButtons, setShowCardButtons] = useState(false);

    const benefits = [
        '30% commission excl. tax**',
        'Up to 25 artwork uploads',
        'International payment management',
        'Priority customer support'
    ]

    const Button = ({label, remove}: {label: string, remove?: boolean}) => {
        return(
            <TouchableOpacity style={{flex: 1}}>
                <View style={styles.button}>
                    <Text style={{color: remove ? '#ff0000' : colors.primary_black}}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.planTitleContainer}>
                        <Text style={{fontSize: 16, color: colors.primary_black}}>Business Plan</Text>
                        <View style={{flexWrap: 'wrap'}}><View style={styles.activePill}><Text style={{fontSize: 12, fontWeight: 500, color: '#ff0000'}}>Paused</Text></View></View>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={{fontSize: 20, fontWeight: 500, color: colors.primary_black}}>$200</Text>
                        <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>/yearly</Text>
                    </View>
                </View>
                <View style={[styles.bottomContainer, {gap: 10}]}>
                    {benefits.map((benefit, index) => (
                        <View style={styles.benefit} key={index}>
                            <Feather name='check' size={14} color={'#0F513278'} />
                            <Text style={{color: colors.primary_black, opacity: 0.8}}>{benefit}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>Next billing date: 14th July 2024</Text>
                </View>
            </View>

            <View style={[styles.container, {marginTop: 30, marginBottom: 50}]}>
                <View style={styles.topContainer}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, color: colors.primary_black, marginBottom: 5}}>Payment method</Text>
                        <Text style={{fontSize: 14, color: colors.primary_black}}>**** **** **** **** 6789</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowCardButtons(prev => !prev)} style={{height: 40, width: 40, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.grey50, backgroundColor: '#f5f5f5'}}>
                        <Feather name={showCardButtons ? 'chevron-up' : 'chevron-down'} size={20} color={colors.grey} />
                    </TouchableOpacity>
                </View>
                {showCardButtons &&
                    <View style={[styles.bottomContainer, {flexDirection: 'row', gap: 10}]}>
                        <Button label='Update card' />
                        <Button label='Remove card' remove />
                    </View>
                }
            </View>

            <LongBlackButton
                value='Manage subscriptions'
                onClick={() => void('')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ff000035',
        borderRadius: 10,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    },
    planTitleContainer: {
        flex: 1,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    amountContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4
    },
    activePill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        backgroundColor: '#ff000020'
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ff000020'
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
    benefit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})