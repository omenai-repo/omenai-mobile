import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Preferences({preferences} : {preferences: string[]}) {

    const PreferencePill = ({value} : {value: string}) => {
        return(
            <TouchableOpacity activeOpacity={0.5}>
                <View style={styles.pill}>
                    <Text style={styles.pillText}>{value}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <View>
            <Text style={styles.label}>Artwork preferences</Text>
            <View style={styles.container}>
                {preferences.map((preference, index) => (
                    <PreferencePill
                        value={preference}
                        key={index}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    container: {
        flexDirection: 'row',
        rowGap: 10,
        columnGap: 20,
        flexWrap: 'wrap',
        marginTop: 20
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f5f5f5'
    },
    pillText: {
        fontSize: 12,
        color: colors.primary_black
    }
})