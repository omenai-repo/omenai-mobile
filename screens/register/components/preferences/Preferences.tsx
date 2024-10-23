import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../../../config/colors.config';
import { prefrencesList } from '../../../../constants/preferences.constants';
import BackFormButton from '../../../../components/buttons/BackFormButton';
import NextButton from '../../../../components/buttons/NextButton';
import { useIndividualAuthRegisterStore } from '../../../../store/auth/register/IndividualAuthRegisterStore';
import { mediumListing } from 'data/uploadArtworkForm.data';

type TabItemProps = {
    name: string,
    isSelected: boolean,
    onSelect: () => void
}

export default function Preferences() {
    const {pageIndex, setPageIndex, preferences, setPreferences } = useIndividualAuthRegisterStore();

    const handleSelect = (value: string) => {
        if (preferences.includes(value)) {
            let arr = [...preferences];
            let index = arr.indexOf(value);
            arr.splice(index, 1);
            setPreferences(arr);
          } else if(preferences.length < 5){
            setPreferences([...preferences, value]);
          }
    }

    const TabItem = ({name, isSelected, onSelect}: TabItemProps) => {

        if(isSelected)
        return(
            <TouchableOpacity style={[styles.tabItem, styles.selectedTabItem]} activeOpacity={0.7} onPress={onSelect}>
                <Text style={{fontSize: 12, color: '#fff'}}>{name}</Text>
            </TouchableOpacity>
        )

        return(
            <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={onSelect}>
                <Text style={{fontSize: 12, color: '#1a1a1a'}}>{name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{marginTop: 20}}>
            <Text style={styles.title}>We would like understand your art interests, please select up to <Text style={{fontWeight: 500, color: colors.primary_black}}>5 artwork mediums</Text> that resonates with you most</Text>
            <View style={styles.tabsContainer}>
                {mediumListing.map((i, idx) => (
                    <TabItem
                        name={i.value}
                        key={idx}
                        onSelect={() => handleSelect(i.value)}
                        isSelected={preferences.includes(i.value)}
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
        color: colors.primary_black,
        fontSize: 16
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
        rowGap: 10,
        columnGap: 10
    },
    tabItem: {
        height: 40,
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