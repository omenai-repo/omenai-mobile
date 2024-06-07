import { Dimensions, Image, StyleSheet, Text, View, NativeSyntheticEvent, NativeScrollEvent, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import { colors } from 'config/colors.config'

const { width: windowWidth } = Dimensions.get('window');
const ITEM_WIDTH = windowWidth; // Width of each item, adjust this to your needs
const CENTER_OFFSET = (windowWidth - ITEM_WIDTH) / 2;

type BannerItemProps = {
    image?: string,
    title: string,
    text: string,
    buttonLabel?: string,
    showButton: boolean
}

const data: BannerItemProps[] =[
    {
        image: 'https://images.saatchiart.com/saatchi/1393639/art/6885443/5954793-HSC00001-7.jpg',
        title: '2024 New Art Inspo',
        text: 'Exciting news ✨. Our Omenai gallery is now opened in london',
        buttonLabel: 'Read article',
        showButton: true
    },
    {
        image: 'https://i.pinimg.com/736x/8a/f5/68/8af568d2dab958de07c9099b29c15d2d.jpg',
        title: '$500,000 Artwork sold',
        text: 'The taj-mahal paintaing has been purchased for $500,000 on the Omenai platform 🚀',
        buttonLabel: 'Read article',
        showButton: true
    },
    {
        image: 'https://blog.yourdesignjuice.com/wp-content/uploads/2023/02/dg-art-illustraton-feb-2023.jpg',
        title: 'Most liked artwork',
        text: 'Fan favourite artwork "Levurn" is the most liked artwork on our platform',
        buttonLabel: 'View artwork',
        showButton: true
    }
];



export default function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / ITEM_WIDTH);
        setCurrentIndex(index);
    };

    const Item = ({image, text, title, buttonLabel, showButton}: BannerItemProps) => {
        return(
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: image}} style={{width: '100%', height: '100%'}} resizeMode="contain" />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 21, fontWeight: '500', color: colors.white}}>{title}</Text>
                    <Text style={{fontSize: 14, color: colors.white, marginTop: 7}}>{text}</Text>
                    
                    <View style={{flexWrap: 'wrap'}}>
                        {showButton && <View style={styles.button}><Text style={{fontSize: 14, fontWeight: '500', color: colors.white}}>{buttonLabel}</Text></View>}
                    </View>
                </View>
            </View>
        )
    };

    return (
        <View>
            <View style={{backgroundColor: colors.primary_black, marginTop: 40}}>
                <FlatList
                    data={data}
                    renderItem={({item}: {item: BannerItemProps}) => (
                        <Item
                            title={item.title}
                            text={item.text}
                            buttonLabel={item.buttonLabel}
                            image={item.image}
                            showButton={item.showButton}
                        />
                    )}
                    keyExtractor={(_, index) => JSON.stringify(index)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={ITEM_WIDTH}
                    decelerationRate="fast"
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                />
            </View>
            <View style={styles.indicatorsContainer}>
                {data.map((_, index) => (
                    <View 
                        style={[styles.indicator, index === currentIndex && {backgroundColor: colors.primary_black}]}
                        key={index}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 250,
        backgroundColor: colors.primary_black,
        flexDirection: 'row',
        width: windowWidth
    },
    imageContainer: {
        width: 190,
        paddingHorizontal: 10
    },
    contentContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,
        justifyContent: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 30,
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 30
    },
    indicatorsContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10
    },
    indicator: {
        height: 8,
        width: 8,
        borderRadius: 5,
        backgroundColor: '#ddd'
    }
})