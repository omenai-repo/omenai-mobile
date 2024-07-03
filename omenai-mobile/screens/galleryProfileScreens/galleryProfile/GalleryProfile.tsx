import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { PageButtonCard } from 'components/buttons/PageButtonCard'
import Divider from 'components/general/Divider'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'

export default function GalleryProfile() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 20}}>Profile</Text>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer}>
                <View style={styles.buttonsContainer}>
                    <PageButtonCard name='Gallery profile' subText='View and edit your profile details' handlePress={() => navigation.navigate(screenName.gallery.editProfile)} />
                    <Divider />
                    <PageButtonCard name='Settings' subText='See all your saved artworks' handlePress={() => navigation.navigate(screenName.gallery.settings)} />
                </View>
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
    buttonsContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: colors.grey50,
        padding: 15,
        gap: 20
    }
})