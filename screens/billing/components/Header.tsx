import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { billingTabs } from '../Billing'
import { colors } from 'config/colors.config'

type BillingHeaderProps = {
    selectedTab: billingTabs,
    handleUpdate: (tab: billingTabs) => void
}

export default function Header({selectedTab, handleUpdate}: BillingHeaderProps) {
    const tabs : billingTabs[] = ["monthly", "yearly"];

    return (
        <View style={styles.mainContainer}>
            {tabs.map((tab: billingTabs, index: number) => (
                <TouchableOpacity
                    onPress={() => handleUpdate(tab)}
                    key={index}
                    style={{height: 45, flex: 1}}
                >
                    <View 
                        style={[styles.item, (selectedTab === tab) && {backgroundColor: colors.black}]}
                    >
                        <Text style={{textTransform: 'capitalize', color: (selectedTab === tab) ? colors.white : colors.grey}}>{tab}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 7,
    },
    item: {
        height: '100%',
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center'
    }
})