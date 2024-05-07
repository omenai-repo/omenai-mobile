import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FittedBlackButton from '../../../../components/buttons/FittedBlackButton'
import BackFormButton from '../../../../components/buttons/BackFormButton'
import { COLORS } from '../../../../config/colors.config';
import { ACCEPT_Terms } from '../../../../constants/accetTerms.constants';
import AntDesign from '@expo/vector-icons/AntDesign';

type TermsAndConditionItemProps = {
    writeUp: string,
    isSelected: boolean,
    handleSelect: () => void
}

export default function TermsAndConditions({handleBack}: {handleBack: () => void}) {
    const [selectedTerms, setSelectedTerms] = useState<number[]>([]);

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
                <View style={styles.tickBox}>{isSelected && <AntDesign name='check' color={COLORS.primary_black} size={15} />}</View>
                <Text style={styles.writeUp}>{writeUp}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{marginTop: 20}}>
            <Text style={styles.title}>Accept terms and conditions</Text>
            <View style={styles.termsContainer}>
                {ACCEPT_Terms.map((i, idx) => (
                    <TermsAndConditionItem
                        writeUp={i}
                        key={idx}
                        isSelected={selectedTerms.includes(idx)}
                        handleSelect={() => handleAcceptTerms(idx)}
                    />
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <BackFormButton handleBackClick={handleBack} />
                <View style={{flex: 1}} />
                <FittedBlackButton value='Create my acount' isDisabled={false} onClick={() => console.log('')}  />
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
        borderColor: COLORS.inputBorder,
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
        borderColor: COLORS.inputBorder,
        alignItems: 'center',
        justifyContent: 'center'
    },
    writeUp: {
        color: '#858585',
        fontSize: 14,
        flex: 1
    }
})