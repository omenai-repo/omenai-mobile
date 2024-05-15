import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons'
import ArtworkCard from 'components/artwork/ArtworkCard'
import { useHomeStore } from 'store/home/homeStore'
import { fetchArtworkImpressions } from '../../../../services/artworks/fetchArtworkImpressions'

export default function Explore() {
    const { isLoading, setIsLoading } = useHomeStore();

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        handleFetchArtworks()
    }, []);

    const handleFetchArtworks = async () => {
        setIsLoading(true)
        const results = await fetchArtworkImpressions();

        let arr = []

        if(results.isOk){
            arr = results.body.data.slice(0, 4)

            var indexToSplit = arr.length / 2;
            var first = arr.slice(0, 2);
            var second = arr.slice(indexToSplit, 4);

            setData([first, second])
        }else{
            Alert.alert(results.body)
        }

        setIsLoading(false)
    }

    return (
        <View style={{marginTop: 40}}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{flexWrap: 'wrap'}}>
                        <View style={styles.selectButton}>
                            <Text style={{fontSize: 14, color: colors.white}}>Popular Artworks</Text>
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
            {isLoading ? 
                (<View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>)
                :
                <View style={styles.artworksContainer}>
                    <View style={styles.singleColumn}>
                        {data[0]?.map((i: any, idx: any) => (
                            <ArtworkCard
                                key={idx}
                                title={i.title}
                                artist={i.artist}
                                price={i.pricing.price || 0}
                                showPrice={i.pricing.shouldShowPrice}
                                image={i.url}
                                medium={i.medium}
                                materials={i.materials}
                                rarity={i.rarity}
                            />
                        ))}
                    </View>
                    <View style={styles.singleColumn}>
                        {data[1]?.map((i: any, idx: any) => (
                            <ArtworkCard
                                key={idx}
                                title={i.title || ''}
                                artist={i.artist || ''}
                                price={i.price || 0}
                                showPrice={i.pricing.shouldShowPrice}
                                image={i.url}
                                medium={i.medium}
                                materials={i.materials}
                                rarity={i.rarity}
                            />
                        ))}
                    </View>
                </View>
            }
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
    },
    loadingContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    }
})