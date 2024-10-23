import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { utils_handleFetchUserID } from 'utils/utils_asyncStorage'
import useLikedState from 'custom/hooks/useLikedState'

type SaveArtworkButtonProps = {
    likeIds: string[],
    art_id: string,
    impressions: number
}

export default function SaveArtworkButton({likeIds, art_id, impressions}: SaveArtworkButtonProps) {
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        handleFetchUserSessionData()
    }, [])


    const handleFetchUserSessionData = async () => {
        const userId = await utils_handleFetchUserID();
        setSessionId(userId)
    }
    
    const { likedState, handleLike } = useLikedState(
        impressions,
        likeIds,
        sessionId,
        art_id
    ); 

    return (
        <>
            {(sessionId === undefined ||
                (sessionId && !likedState.ids.includes(sessionId))) && (
                <TouchableOpacity onPress={() => handleLike(true)}>
                    <View style={styles.likeContainer}>
                        <View style={[styles.tagItem, {backgroundColor: '#f5f5f5', gap: 10, paddingHorizontal: 20}]}><AntDesign color={colors.primary_black} name='hearto' /><Text>Save artwork</Text></View>
                    </View>
                </TouchableOpacity>
            )}
            {sessionId !== undefined && likedState.ids.includes(sessionId) && (
                <TouchableOpacity onPress={() => handleLike(false)}>
                    <View style={styles.likeContainer}>
                        <View style={[styles.tagItem, {backgroundColor: '#f5f5f5', gap: 10, paddingHorizontal: 20}]}><AntDesign color={'#ff0000'} name='heart' /><Text>Remove from saved</Text></View>
                    </View>
                </TouchableOpacity>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    likeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E7F6EC'
    },
    tagItemText: {
        color: colors.secondary_text_color,
        fontSize: 12
    },
})