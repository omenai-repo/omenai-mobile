import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config';

export default function ManageSubscriptionsSection() {

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
            <Button label='Upgrade/Downgrade plan' />
            <Button label='Cancel subscription' remove />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 15,
        marginTop: 30,
    },
    button: {
        height: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 10
    }
})