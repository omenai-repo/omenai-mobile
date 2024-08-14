import { colors } from 'config/colors.config';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Button = ({label, remove}: {label: string, remove?: boolean}) => {
    return(
        <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
            <View style={styles.button}>
                <Text style={{color: remove ? '#ff0000' : colors.primary_black}}>{label}</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
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

export default Button