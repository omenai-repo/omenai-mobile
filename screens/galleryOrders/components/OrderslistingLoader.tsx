import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import Divider from 'components/general/Divider'

export default function OrderslistingLoader() {

    const Item = () => {
        return(
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <View style={{flex: 1}}>
                    <View style={{height: 15, width: 200, backgroundColor: colors.grey50}} />
                    <View style={{height: 15, width: 100, backgroundColor: colors.grey50, marginTop: 10}} />
                </View>
                <View style={{height: 30, width: 100, backgroundColor: colors.grey50}}  />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={[0,1,2,3]}
                renderItem={() => <Item />}
                keyExtractor={(_, index) => JSON.stringify(index)}
                ItemSeparatorComponent={() => <View style={{paddingVertical: 30}}><Divider /></View>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30
    }
})