import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CheckoutStepper from 'components/checkoutStepper/CheckoutStepper'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

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
        paddingTop: 10
    }
})