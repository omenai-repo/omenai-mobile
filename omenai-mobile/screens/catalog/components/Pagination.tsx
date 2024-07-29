import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import FittedBlackButton from 'components/buttons/FittedBlackButton';

type PaginationTypes = "inc" | "dec"

type PaginationProps = {
    count: number,
    currentScreen: number,
    onPress: (e: PaginationTypes) => void
}

export default function Pagination({count, currentScreen, onPress}: PaginationProps) {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 12, textAlign: 'center'}}>Showing page ${currentScreen} of ${count}</Text>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 20}}>
                <FittedBlackButton 
                    value='Prev' 
                    onClick={()=> onPress("dec")} 
                    isDisabled={currentScreen === 1}
                />
                <FittedBlackButton 
                    value='Next' 
                    onClick={()=> onPress("inc")} 
                    isDisabled={currentScreen === count}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 'auto',
        marginTop: 30
    }
})