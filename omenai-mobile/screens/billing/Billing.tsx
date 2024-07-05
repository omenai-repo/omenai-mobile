import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import Header from './components/Header'
import { plan_details } from 'constants/plan_details'
import Plan from './components/Plan'

export type billingTabs = "monthly" | "yearly"

export default function Billing() {
    const [selectedTab, setSelectedTab] = useState<billingTabs>("monthly");
    
    return (
        <WithModal>
            <BackHeaderTitle title='Billing' />
            <ScrollView style={styles.container}>
                <Header selectedTab={selectedTab} handleUpdate={setSelectedTab} />
                <View style={styles.mainContainer}>
                    {plan_details.map((plan, index) => (
                        <Plan
                            key={index}
                            name={plan.name}
                            benefits={plan.benefits}
                            monthly_price={plan.monthly_price}
                            yearly_price={plan.yearly_price}
                            tab={selectedTab}
                        />
                    ))}
                </View>
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        marginTop: 10
    },
    mainContainer: {
        marginTop: 20,
        gap: 20,
        paddingBottom: 50
    }
})