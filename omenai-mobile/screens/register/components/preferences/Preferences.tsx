import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '@/config/colors.config';
import { prefrencesList } from '@/constants/preferences.constants';
import BackFormButton from '@/components/buttons/BackFormButton';
import NextButton from '@/components/buttons/NextButton';
import { useIndividualAuthRegisterStore } from '@/store/auth/register/IndividualAuthRegisterStore';

type TabItemProps = {
    name: string,
    isSelected: boolean,
    onSelect: () => void
}

export default function Preferences() {
    const {pageIndex, setPageIndex, preferences, setPreferences } = useIndividualAuthRegisterStore();
    // const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

    const handleSelect = (value: string) => {
        if (preferences.includes(value)) {
            setPreferences(preferences.filter((selectedTab) => selectedTab !== value));
          } else {
            setPreferences([...preferences, value]);
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
                {prefrencesList.map((i, idx) => (
                    <TabItem
                        name={i}
                        key={idx}
                        onSelect={() => handleSelect(i)}
                        isSelected={preferences.includes(i)}
                    />
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
                <View style={{flex: 1}} />
                <NextButton isDisabled={preferences.length < 5} handleButtonClick={() => setPageIndex(pageIndex + 1)}  />
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
        borderColor: colors.inputBorder,
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
        borderColor: colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTabItem: {
        backgroundColor: colors.black
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 60
    }
})