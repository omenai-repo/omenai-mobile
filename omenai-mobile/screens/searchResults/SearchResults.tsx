import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import Filters from './components/filters/Filters'
import ArtworkCard from 'components/artwork/ArtworkCard'
import { useSearchStore } from 'store/search/searchStore'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { fetchSearchKeyWordResults } from 'services/search/fetchSearchKeywordResults'
import ResultsListing from './components/resultsListing/ResultsListing'

export default function SearchResults() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { searchQuery, setIsLoading, isLoading } = useSearchStore();

    const [data, setData] = useState<any[]>([]);
    const [dataLength, setDataLength] = useState(0);

    useEffect(() => {
        handleFetchSearch();
    }, [searchQuery]);

    const handleFetchSearch = async () => {
        setIsLoading(true)
        const results = await fetchSearchKeyWordResults(searchQuery);

        let arr = []

        if(results.isOk){
            arr = results.body.data

            if(arr.length > 1){
                var indexToSplit = Math.floor(arr.length / 2);
                var first = arr.slice(0, indexToSplit);
                var second = arr.slice(indexToSplit);
    
                setData([first, second])
            }else{
                setData([arr, []])
            }
            
            setDataLength(arr.length)
        }else{
            Alert.alert(results.body)
        }

        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <SafeAreaView>
                    <BackScreenButton handleClick={() => navigation.goBack()} />
                </SafeAreaView>
                <Text style={styles.headerText}>Search for “{searchQuery}”:</Text>
                {isLoading ? 
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                :
                    <View style={{flex: 1}}>
                        <Filters dataLength={dataLength}  />
                        <ResultsListing data={data} />
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    headerText: {
        fontSize: 24,
        color: colors.primary_black, 
        paddingVertical: 20
    },
    artworksContainer: {
        flexDirection: 'row',
        gap: 20
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