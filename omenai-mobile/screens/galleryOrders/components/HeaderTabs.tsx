import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Platform, StatusBar} from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { galleryOrdersStore, galleryOrdersTab } from 'store/gallery/galleryOrdersStore'

export default function HeaderTabs() {
    const tabs : galleryOrdersTab[] = ['pending', 'processing', 'completed'];

    const {selectedTab, setSelectedTab} = galleryOrdersStore()

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={{fontSize: 20, textAlign: 'center'}}>Orders</Text>
                <View style={styles.mainContainer}>
                    {tabs.map((tab: galleryOrdersTab, index: number) => (
                        <TouchableOpacity
                            onPress={() => setSelectedTab(tab)}
                            key={index}
                            style={{height: 45, flex: 1}}
                        >
                            <View 
                                style={[styles.item, (tab === selectedTab) && {backgroundColor: colors.black}]}
                            >
                                <Text style={{textTransform: 'capitalize', color: (tab === selectedTab) ? colors.white : colors.grey}}>{tab}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
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
        marginTop: 20
    },
    item: {
        height: '100%',
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
})