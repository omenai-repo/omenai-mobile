import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { FlatList } from 'react-native-gesture-handler';

const { width: windowWidth } = Dimensions.get('window');
const ITEM_WIDTH = windowWidth; // Width of each item, adjust this to your needs
const CENTER_OFFSET = (windowWidth - ITEM_WIDTH) / 2;

type BannerItemProps = {
    image: string,
    title: string,
    text: string,
    buttonLabel?: string,
    showButton: boolean
}

const data: BannerItemProps[] =[
    {
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHWWPo63RuGPEv0ulEbUkec7iwnTH-FpM_7g&s',
        title: 'New Gallery in London',
        text: 'Exciting news ✨. Our Omenai gallery is now opened in london',
        buttonLabel: 'View location',
        showButton: true
    },
    {
        image: 'https://i.pinimg.com/736x/8a/f5/68/8af568d2dab958de07c9099b29c15d2d.jpg',
        title: '$500,000 Artwork sold',
        text: 'The taj-mahal paintaing has been purchased for $500,000 on the Omenai platform 🚀',
        // buttonLabel: 'View location',
        showButton: false
    },
    {
        image: 'https://miro.medium.com/v2/resize:fit:1024/1*7b4mWA8bBHVgDLgvZYANRg.png',
        title: 'Most liked artwork',
        text: 'Fan favourite artwork "Levurn" is the most liked artwork on our platform',
        buttonLabel: 'View artwork',
        showButton: true
    }
];



export default function Banner() {

    const Item = ({image, text, title, buttonLabel, showButton}: BannerItemProps) => {
        return(
            <View style={styles.container}>
                <Image source={{uri: image}} style={styles.image} />
                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 16, fontWeight: '500', color: colors.white}}>{title}</Text>
                    <Text style={{fontSize: 14, color: colors.white, marginTop: 5}}>{text}</Text>
                    
                    <View style={{flexWrap: 'wrap'}}>
                        {showButton && <View style={styles.button}><Text style={{fontSize: 14, fontWeight: '500', color: colors.white}}>{buttonLabel}</Text></View>}
                    </View>
                </View>
            </View>
        )
    };

    return (
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
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        backgroundColor: colors.primary_black,
        flexDirection: 'row',
        width: windowWidth
    },
    image: {
        height: 200,
        width: 150,
        backgroundColor: colors.grey50
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
        justifyContent: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 30,
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 20
    }
})