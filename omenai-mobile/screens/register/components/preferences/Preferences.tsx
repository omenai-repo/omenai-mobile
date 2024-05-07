import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../../config/colors.config';
import { PREFERENCES } from '../../../../constants/preferences.constants';
import BackFormButton from '../../../../components/buttons/BackFormButton';
import NextButton from '../../../../components/buttons/NextButton';

type TabItemProps = {
    name: string,
    isSelected: boolean,
    onSelect: () => void
}

type PreferencesProps = {
    handleBack: () => void,
    handleNext: () => void
}

export default function Preferences({handleBack, handleNext}: PreferencesProps) {
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

    const handleSelect = (value: string) => {
        if (selectedPreferences.includes(value)) {
            setSelectedPreferences(selectedPreferences.filter((selectedTab) => selectedTab !== value));
          } else {
            setSelectedPreferences([...selectedPreferences, value]);
          }
    }

    const TabItem = ({name, isSelected, onSelect}: TabItemProps) => {

        if(isSelected)
        return(
            <TouchableOpacity style={[styles.tabItem, styles.selectedTabItem]} onPress={onSelect}>
                <Text style={{fontSize: 12, color: '#fff'}}>{name}</Text>
            </TouchableOpacity>
        )

        return(
            <TouchableOpacity style={styles.tabItem} onPress={onSelect}>
                <Text style={{fontSize: 12, color: '#1a1a1a'}}>{name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{marginTop: 20}}>
            <Text style={styles.title}>Select your art preference</Text>
            <View style={styles.tabsContainer}>
                {PREFERENCES.map((i, idx) => (
                    <TabItem
                        name={i}
                        key={idx}
                        onSelect={() => handleSelect(i)}
                        isSelected={selectedPreferences.includes(i)}
                    />
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <BackFormButton handleBackClick={handleBack} />
                <View style={{flex: 1}} />
                <NextButton isDisabled={false} handleButtonClick={handleNext}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        fontSize: 20
    },
    tabsContainer: {
        marginTop: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        paddingHorizontal: 15,
        paddingVertical: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 20,
        columnGap: 15
    },
    tabItem: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTabItem: {
        backgroundColor: COLORS.black
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 60
    }
})