import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors } from 'config/colors.config';

type FormsHeaderNavigationProps = {
    index: number,
    setIndex: (e: number) => void
}

type TabsProps = {
    icon: React.ReactNode,
    active: boolean,
    value: number
}

export default function FormsHeaderNavigation({index, setIndex} : FormsHeaderNavigationProps){

    const TabItem = ({icon, active, value}: TabsProps) => {
        return(
            <TouchableOpacity onPress={() => setIndex(value)} activeOpacity={1}>
                <View style={[styles.tab, active && {backgroundColor: colors.primary_black}]}>
                    {icon}
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <TabItem
                icon={<MaterialCommunityIcons name='credit-card-outline' size={20} color={index >= 0 ? colors.white: colors.primary_black} />}
                active={index >= 0}
                value={0}
            />
            <View style={[styles.divider, index > 0 && {backgroundColor: colors.primary_black}]} />
            <TabItem
                icon={<MaterialIcons name='pin' size={20} color={index >= 1 ? colors.white: colors.primary_black}  />}
                active={index >= 1}
                value={1}
            />
            <View style={[styles.divider, index > 1 && {backgroundColor: colors.primary_black}]} />
            <TabItem
                icon={<MaterialCommunityIcons name='credit-card-check' size={20} color={index >= 2 ? colors.white: colors.primary_black}  />}
                active={index >= 2}
                value={2}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    divider: {
        flex: 1,
        height: 4,
        backgroundColor: '#f1f1f1'
    },
    tab: {
        height: 45,
        width: 45,
        borderRadius: 30,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center'
    }
})