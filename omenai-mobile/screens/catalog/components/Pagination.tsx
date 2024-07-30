import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import Loader from 'components/general/Loader';

type PaginationTypes = "inc" | "dec"

type PaginationProps = {
    count: number,
    currentScreen: number,
    onPress: (e: PaginationTypes) => void,
    isLoading: boolean
}

export default function Pagination({count, currentScreen, onPress, isLoading}: PaginationProps) {

    if(isLoading)return(
        <View style={styles.container}>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 20}}>
                <FittedBlackButton 
                    value=''
                    onClick={()=>{}} 
                    isDisabled={true}
                    isLoading={isLoading}
                >
                    <Loader size={100} />
                </FittedBlackButton>
            </View>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 20}}>
                <FittedBlackButton 
                    value={isLoading ? 'Loading...' : 'Load more'} 
                    onClick={()=> onPress("inc")} 
                    isDisabled={currentScreen === count}
                    isLoading={isLoading}
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