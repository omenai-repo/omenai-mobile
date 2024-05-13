import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons'
import ArtworkCard from 'components/artwork/ArtworkCard'

export default function Explore() {
    return (
        <View style={{marginTop: 40}}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{flexWrap: 'wrap'}}>
                        <View style={styles.selectButton}>
                            <Text style={{fontSize: 14, color: colors.white}}>Tailored for you</Text>
                            <Feather name='chevron-down' color={colors.white} size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity>
                        <View style={styles.seeMoreButton}>
                            <Text style={{fontSize: 14, color: colors.primary_black}}>See more</Text>
                            <Feather name='arrow-right' color={colors.primary_black} size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.artworksContainer}>
                <View style={styles.singleColumn}>
                    <ArtworkCard />
                    <ArtworkCard />
                </View>
                <View style={styles.singleColumn}>
                    <ArtworkCard />
                    <ArtworkCard />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    selectButton: {
        height: 50,
        backgroundColor: colors.primary_black,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 30,
        gap: 10,
    },
    seeMoreButton: {
        height: 50,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 30,
        gap: 10
    },
    artworksContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30
    },
    singleColumn: {
        flex: 1,
        gap: 20
    }
})