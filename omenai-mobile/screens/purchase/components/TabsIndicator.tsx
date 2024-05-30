import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config';

type TabItemProps = {
    title: string,
    index: number,
    isActive: boolean
};

const tabs = [
    'Order summary',
    'Shipping details',
    'Review & Payment'
]

export default function TabsIndicator({selectedIndex}: {selectedIndex: number}) {

    const TabItem = ({title, index, isActive}: TabItemProps) => {
        return(
            <View style={{flex: 1}}>
                <View style={[styles.tabItemBox, isActive && {backgroundColor: colors.primary_black}]}><Text style={{fontSize: 14, fontWeight: '500', color: colors.white}}>{index}</Text></View>
                <Text style={[styles.tabItemTitle, isActive && {color: colors.primary_black}]}>{title}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => (
                <TabItem
                    key={index}
                    title={tab}
                    index={index + 1}
                    isActive={(index + 1) <= selectedIndex}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grey50,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    tabItemBox: {
        height: 20,
        width: 20,
        borderRadius: 3,
        backgroundColor: colors.grey,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabItemTitle: {
        color: colors.grey,
        fontSize: 12,
        fontWeight: '500',
        marginTop: 10
    }
})