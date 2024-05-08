import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import FittedBlackButton from '@/components/buttons/FittedBlackButton'
import BackFormButton from '@/components/buttons/BackFormButton'
import { colors } from '@/config/colors.config';
import { acceptTermsList } from '@/constants/accetTerms.constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIndividualAuthRegisterStore } from '@/store/auth/register/IndividualAuthRegisterStore';

type TermsAndConditionItemProps = {
    writeUp: string,
    isSelected: boolean,
    handleSelect: () => void
}

export default function TermsAndConditions() {
    const {pageIndex, setPageIndex, selectedTerms, setSelectedTerms} = useIndividualAuthRegisterStore();

    const handleAcceptTerms = (index: number) => {
        if (selectedTerms.includes(index)) {
            setSelectedTerms(selectedTerms.filter((selectedTab) => selectedTab !== index));
        } else {
            setSelectedTerms([...selectedTerms, index]);
        }
    }

    const TermsAndConditionItem = ({writeUp, isSelected, handleSelect}: TermsAndConditionItemProps) => {
        return(
            <TouchableOpacity style={styles.singleItem} onPress={handleSelect}>
                <View style={styles.tickBox}>{isSelected && <AntDesign name='check' color={colors.primary_black} size={15} />}</View>
                <Text style={styles.writeUp}>{writeUp}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{marginTop: 20}}>
            <Text style={styles.title}>Accept terms and conditions</Text>
            <View style={styles.termsContainer}>
                {acceptTermsList.map((i, idx) => (
                    <TermsAndConditionItem
                        writeUp={i}
                        key={idx}
                        isSelected={selectedTerms.includes(idx)}
                        handleSelect={() => handleAcceptTerms(idx)}
                    />
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
                <View style={{flex: 1}} />
                <FittedBlackButton value='Create my acount' isDisabled={!selectedTerms.includes(0)} onClick={() => console.log('')}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        fontSize: 20
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 60
    },
    termsContainer: {
        marginTop: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 15,
        paddingVertical: 20,
        gap: 30
    },
    singleItem: {
        flexDirection: 'row',
        gap: 10
    },
    tickBox: {
        height: 20,
        width: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center'
    },
    writeUp: {
        color: '#858585',
        fontSize: 14,
        flex: 1
    }
})