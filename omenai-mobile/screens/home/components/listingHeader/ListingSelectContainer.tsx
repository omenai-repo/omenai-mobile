import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../../../config/colors.config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHomeStore } from 'store/home/homeStore'

type ArtworkSelectItemProps = {
    name: string,
    value: artworkListingType
}

export default function ListingSelectContainer() {
    const { showSelectModal, setShowSelectModal, setListingType } = useHomeStore();

    const handleClick = (e: artworkListingType) => {
        setShowSelectModal(false)

        setListingType(e)
    }

    const Item = ({name, value} : ArtworkSelectItemProps) => {
        return(
            <TouchableOpacity onPress={() => handleClick(value)}>
                <View style={styles.item}>
                    <Text style={styles.text}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    if(showSelectModal)
    return (
        <View style={styles.artworkListingSelect}>
            {/* <Item value='popular' name='Popular Artworks' /> */}
            <Item value='recent' name='Recent Artworks' />
            <Item value='trending' name='Trending Artworks' />
            <Item value='curated' name='Curated Artworks' />
        </View>
    )
}

const styles = StyleSheet.create({
    artworkListingSelect: {
        width: 300,
        backgroundColor: colors.white,
        position: 'absolute',
        top: 100,
        zIndex: 200,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 10,
        overflow: 'hidden'
    },
    item: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder
    },
    text: {
        fontSize: 14,
        color: colors.primary_black
    }
})