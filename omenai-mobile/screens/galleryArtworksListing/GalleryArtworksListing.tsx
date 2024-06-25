import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import WithModal from 'components/modal/WithModal'
import { Feather } from '@expo/vector-icons'
import FittedBlackButton from 'components/buttons/FittedBlackButton'

export default function GalleryArtworksListing() {
    return (
        <WithModal>
            <SafeAreaView>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, flex: 1}}>Artworks</Text>
                    <FittedBlackButton value='Upload artwork' isDisabled={false} onClick={() => console.log('')}>
                        <Feather name='plus' color={'#fff'} size={20} />
                    </FittedBlackButton>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* TODO: ADD LISTING FOR GALLERY ARTWORKS */}
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        // backgroundColor: '#ff0000',
        paddingTop: 20,
        marginTop: 20
    }
})