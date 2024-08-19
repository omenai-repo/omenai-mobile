import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CheckoutStepper from 'components/checkoutStepper/CheckoutStepper'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { colors } from 'config/colors.config';

export default function ChangeCard() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [activeIndex, setActiveIndex] = useState<number>(0);

    return (
        <WithModal>
            <BackHeaderTitle title='Change card' />
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.detailsContainer}>
                    <View style={styles.topContainer}>
                        <Text style={{color: colors.white, fontSize: 16}}>Change card</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={{fontSize: 13, color: '#ff0000'}}>NOTE: A small, temporary charge of $1 will be applied to verify your card. This charge will be refunded to you immediately.</Text>
                    </View>
                </View>

                <CheckoutStepper
                    activeIndex={activeIndex}
                    plan={null}
                    setActiveIndex={setActiveIndex}
                    setVerificationScreen={() => navigation.navigate(screenName.verifyTransaction)}
                    updateCard={true}
                />
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
        paddingTop: 10,
    },
    detailsContainer: {
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 7,
        overflow: 'hidden',
        marginBottom: 30
    },
    topContainer: {
        backgroundColor: colors.primary_black,
        padding: 15
    },
    mainContainer: {
        padding: 15,
        gap: 15
    },
})