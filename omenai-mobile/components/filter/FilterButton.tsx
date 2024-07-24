import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from 'config/colors.config';
import sortIcon from '../../assets/icons/sort-icon.png';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';

type FilterButtonProps = {
    children?: React.ReactNode,
    handleClick?: () => void
}

export default function FilterButton({children, handleClick}: FilterButtonProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.mainContainer}>
            <View style={{flex: 1}}>
                {children}
            </View>
            <TouchableOpacity onPress={() => {
                if(handleClick){
                    handleClick()
                }else{
                    navigation.navigate(screenName.filter)
                }
            }}>
                <View style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Filters</Text>
                    <Image source={sortIcon} style={styles.sortIcon} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    filterButton: {
        height: 40,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        // backgroundColor: '#FAFAFA',
        borderRadius: 30,
        // borderWidth: 1,
        // borderColor: colors.inputBorder,
    },
    filterButtonText: {
        fontSize: 14,
        color: colors.primary_black
    },
    sortIcon: {
        height: 20,
        width: 20
    },
})