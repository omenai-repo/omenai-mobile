import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { mediums } from 'constants/mediums';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function CatalogListing() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const CatalogCard = ({image, name, value}: CatalogCardTypes) => {
        return(
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(screenName.artworksMedium, {catalog: value, image: image})}>
                <View style={styles.container}>
                    <Image source={image} style={{width: 220, height: 220}} />
                    <Text style={{fontSize: 14, marginTop: 10}}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{marginTop: 40}}>
            <Text style={{fontSize: 18, fontWeight: 500, paddingHorizontal: 20}}>Catalog</Text>
            <FlatList 
                data={mediums}
                renderItem={({item, index}: {item: CatalogCardTypes, index: string}) => (
                    <CatalogCard
                        name={item.name}
                        image={item.image}
                        key={index}
                        value={item.value}
                    />
                )}
                keyExtractor={(_, index) => JSON.stringify(index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 20, paddingHorizontal: 20}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 220,
        marginRight: 29
    }
})