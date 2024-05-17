import { StyleSheet, Text, View } from 'react-native'
import Modal from "react-native-modal";
import React, { ReactNode, useState } from 'react'
import { colors } from 'config/colors.config';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import LongBlackButton from 'components/buttons/LongBlackButton';
import LongWhiteButton from 'components/buttons/LongWhiteButton';

type ModalProps = {
    value: string | null,
    handleDismiss: (e? : string | boolean) => void,
    isVisible: boolean,
    multiChoice?: string,
}

export default function CustomModal({value, handleDismiss, isVisible, multiChoice}: ModalProps) {

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.container}>
                <Text style={{fontSize: 18}}>{value}</Text>
                <View style={styles.buttonBottom}>
                    {multiChoice &&
                        <View style={{flex: 1}}>
                            <LongWhiteButton
                                value='Dismiss'
                                onClick={handleDismiss}
                            />
                        </View>
                    }
                    <View style={{flex: 1}}>
                        <LongBlackButton
                            value={multiChoice ? multiChoice : 'Dismiss'}
                            onClick={() => handleDismiss(true)}
                            isDisabled={false}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.white
    },
    buttonBottom: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10
    }
})