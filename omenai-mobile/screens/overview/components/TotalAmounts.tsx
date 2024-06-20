import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';

type CardProps = {
    name: string,
    amount: string,
    percentage: string,
    type: "amount" | "customers"
}

export default function TotalAmounts() {

    const Card = ({name, amount, percentage, type}: CardProps) => {
        return(
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    {type === "amount" ? 
                        <Ionicons name='document-text-outline' size={21} color={'#0F973D'} />
                        :
                        <Feather name='user' size={21} color={'#0F973D'} />
                    }
                </View>
                <Text style={styles.cardTitle}>{name}</Text>
                <View style={styles.statsDisplay}>
                    <Text style={styles.cardAmount}>{amount}</Text>
                    <View style={styles.percentageContainer}>
                        
                        <Text style={styles.percentageNumber}>{percentage}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 18, fontWeight: '500'}}>Overview</Text>
            <View style={styles.contentsContainer}>
                <Card name='Total amount sold' amount='$10,027' percentage='+3%' type="amount" />
                <Card name='Customers' amount='42' percentage='+10%' type="customers" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    contentsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20
    },
    card: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 15
    },
    iconContainer: {
        height: 40,
        width: 40,
        borderRadius: 4,
        backgroundColor: '#E7F6EC',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardTitle: {
        color: '#0F973D',
        fontSize: 14,
        marginTop: 15
    },
    cardAmount: {
        fontSize: 22,
        fontWeight: '500',
        flex: 1
    },
    statsDisplay: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    percentageContainer: {
        backgroundColor: '#E7F6EC',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    percentageNumber: {
        color: '#0F973D',
        fontSize: 14,
        fontWeight: '500'
    }
})