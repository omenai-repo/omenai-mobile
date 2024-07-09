import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import InActiveSubscription from './components/InActiveSubscription';
import PlanDetails from './components/PlanDetails';
import CardDetails from './components/CardDetails';
import ManageSubscriptionsSection from './components/ManageSubscriptionsSection';
import { useAppStore } from 'store/app/appStore';

export default function Subscriptions() {
    const {userSession} = useAppStore();

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 20, textAlign: 'center'}}>Subscriptions</Text>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                {userSession.subscription_active ?
                    <View>
                        <CardDetails />
                        <PlanDetails />
                        <ManageSubscriptionsSection />
                    </View>
                :
                    <InActiveSubscription />
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    headerContainer: {
        paddingHorizontal: 20,
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1
    },
})