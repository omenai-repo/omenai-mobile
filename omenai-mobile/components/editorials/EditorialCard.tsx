import { Image, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getImageFileView } from 'lib/storage/getImageFileView'
import { colors } from 'config/colors.config'
import { getEditorialImageFilePreview } from 'secure/editorial/admin/lib/getEditorialImageFilePreview'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import { useModalStore } from 'store/modal/modalStore'

export type EditorialCardProps = {
    url: string,
    writer: string,
    articleHeader: string,
    date: string,
    id: string
}

export default function EditorialCard({url, writer, articleHeader, date, id, width}: EditorialCardProps & {width: number}) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { setWebViewUrl } = useModalStore()

    const image_href = getEditorialImageFilePreview(url, width);

    return(
        <>
            <TouchableOpacity activeOpacity={1} onPress={() => setWebViewUrl(`/articles/${id}/${articleHeader}`)}>
                <View style={{width: width, overflow: 'hidden'}}>
                    <Image source={{uri: image_href}} style={styles.image} />
                    <View>
                        <View style={styles.cardDetails}>
                            <Text style={{fontSize: 12, color: '#616161'}}>by {writer}</Text>
                            <View style={{height: 5, width: 5, borderRadius: 5, backgroundColor: '#616161'}} />
                            <Text style={{fontSize: 12, color: '#616161'}}>{date}</Text>
                        </View>
                        <Text style={{fontSize: 18, color: colors.primary_black, marginTop: 15, fontWeight: 500}}>{articleHeader}</Text>
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
        height: 300
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