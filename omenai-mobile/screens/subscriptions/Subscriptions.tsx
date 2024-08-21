import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import InActiveSubscription from './features/InActiveSubscription';
import { useAppStore } from 'store/app/appStore';
import ActiveSubscriptions from './features/ActiveSubscriptions';
import WithModal from 'components/modal/WithModal';

export default function Subscriptions() {
    const { userSession } = useAppStore();

    return (
        <WithModal>
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 20, textAlign: 'center'}}>Subscription & Billing</Text>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                {userSession.subscription_active ?
                    <ActiveSubscriptions />
                :
                    <InActiveSubscription />
                }
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20,
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1
    },
})