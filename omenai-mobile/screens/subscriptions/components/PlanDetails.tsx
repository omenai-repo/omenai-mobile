import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import LongWhiteButton from 'components/buttons/LongWhiteButton'
import LongBlackButton from 'components/buttons/LongBlackButton'
import FittedBlackButton from 'components/buttons/FittedBlackButton'
import { Feather } from '@expo/vector-icons'
import CardDetails from './CardDetails'

export default function PlanDetails() {
    const benefits = [
        '30% commission excl. tax**',
        'Up to 25 artwork uploads',
        'International payment management',
        'Priority customer support'
    ]

    return (
        <View>
            
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.planTitleContainer}>
                        <Text style={{fontSize: 16, color: colors.primary_black}}>Premium Plan</Text>
                        <View style={{flexWrap: 'wrap'}}><View style={styles.activePill}><Text style={{fontSize: 12, fontWeight: 500, color: '#00800080'}}>Active</Text></View></View>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.grey50,
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
        backgroundColor: '#00800015'
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey50
    },
    
    benefit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})