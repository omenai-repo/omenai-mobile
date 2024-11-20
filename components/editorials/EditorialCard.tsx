import { Image, StyleSheet, Text, View, Linking } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getImageFileView } from 'lib/storage/getImageFileView'
import { colors } from 'config/colors.config'
import { getEditorialImageFilePreview } from 'lib/editorial/lib/getEditorialImageFilePreview'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import { useModalStore } from 'store/modal/modalStore'
import { fontNames } from 'constants/fontNames.constants'

export type EditorialCardProps = {
    url: string,
    articleHeader: string,
    link: string,
    date: string,
    minutes: string,
}

export default function EditorialCard({url, link, articleHeader, date, minutes, width}: EditorialCardProps & {width: number}) {

    const handleOpenLink = async () => {
        const parsedLink = 'https://' + link
        const supportedLink = await Linking.canOpenURL(parsedLink);
        if(supportedLink){
            await Linking.openURL(parsedLink)
        }
    }

    const image_href = getEditorialImageFilePreview(url, width);

    return(
        <>
            <TouchableOpacity activeOpacity={1} onPress={handleOpenLink}>
                <View style={{width: width, overflow: 'hidden'}}>
                    <Image source={{uri: image_href}} style={styles.image} />
                    <View>
                        <View style={styles.cardDetails}>
                            <Text style={{fontSize: 12, color: '#616161', fontFamily: fontNames.dmSans + 'Regular'}}>{minutes} Minutes read</Text>
                        </View>
                        <Text style={{fontSize: 14, color: colors.primary_black, marginTop: 15, fontWeight: 400, fontFamily: fontNames.dmSans + 'Medium'}}>{articleHeader}</Text>
                        {/* <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize: 14, marginTop: 10, color: '#616161'}}>This is body content for the blog post. This is body content for the blog post. This is body content for the blog post. This is body content for the blog post. This is body content for the blog post.</Text> */}
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
};

const styles = StyleSheet.create({
    cardDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 10
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 15
    },
    cardButton: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary_black,
    }
})