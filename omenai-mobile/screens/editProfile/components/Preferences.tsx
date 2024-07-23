import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { mediumListing } from 'data/uploadArtworkForm.data'

type PreferencesProps = {
    label: string,
    selectedPreferences: string[],
    setSelectedPreferences: (e: string[]) => void
};

type PillProps = {
    label: string,
    value: string,
    onTap: (e: string) => void
}

export default function Preferences({label, selectedPreferences, setSelectedPreferences}: PreferencesProps) {

    const handleUpdatePreference = (value: string) => {
        if(selectedPreferences.includes(value)){
            //if artwork pereference is selected then get index and remove from selected
            let arr = [...selectedPreferences];
            let index = arr.indexOf(value);
            arr.splice(index, 1);
            setSelectedPreferences(arr);
        }else{
            const arr = [...selectedPreferences, value];
            setSelectedPreferences(arr);
        }
    }

    const Pill = ({label, value, onTap}: PillProps) => {
        const selected = selectedPreferences.includes(value)
        return(
            <TouchableOpacity onPress={() => onTap(value)}>
                <View style={[styles.pill, selected && styles.selectedPill]}>
                    <Text style={[styles.pillText, selected && styles.selectedPillText]}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{gap: 20}}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pillsContainer}>
                {mediumListing.map((medium, index) => (
                    <Pill
                        label={medium.label}
                        value={medium.value}
                        onTap={handleUpdatePreference}
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
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 15,
        columnGap: 10
    },
    pill: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
    },
    pillText: {
        fontSize: 12,
        opacity: 0.8
    },
    selectedPill: {
        backgroundColor: colors.primary_black
    },
    selectedPillText: {
        color: colors.white,
        opacity: 1
    }
})