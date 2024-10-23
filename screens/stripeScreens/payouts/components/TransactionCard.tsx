import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors } from 'config/colors.config'

type TransactionCardProps = {
    id: string,
    net: string,
    gross: string
}

export default function TransactionCard({id, gross, net}: TransactionCardProps) {

    const PillContainer = ({label}:{label: string}) => {
        return(
            <View style={{flexWrap: 'wrap'}}>
                <View style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#17963925', borderRadius: 20}}>
                    <Text style={{fontSize: 12}}>{label}</Text>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.transactionType}><Feather name='arrow-down-left' size={16} style={{opacity: 0.8}} /></View>
            <View style={styles.mainContainer}>
                <View style={{gap: 10}}>
                    <Text style={{fontSize: 14, color: colors.primary_black}}>{id}</Text>
                    <PillContainer label='Completed' />
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', gap: 10, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: colors.grey}}>Gross: <Text style={{color: colors.primary_black}}>{gross}</Text></Text>
                    <Text style={{fontSize: 14, color: colors.grey}}>Net: <Text style={{color: colors.primary_black}}>{net}</Text></Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
    },
    transactionType: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: colors.grey50,
        borderBottomWidth: 1,
        paddingBottom: 20
    }
})