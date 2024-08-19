import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { utils_handleFetchUserID } from 'utils/utils_asyncStorage';
import useLikedState from 'custom/hooks/useLikedState';
import { AntDesign } from '@expo/vector-icons';
import { colors } from 'config/colors.config';

export type LikeComponentProps = {
    likeIds: string[],
    art_id: string,
    impressions: number,
    lightText?: boolean
}

export default function LikeComponent({likeIds, art_id, impressions, lightText}: LikeComponentProps) {
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
                    <AntDesign size={20} color={lightText ? colors.white : colors.primary_black} name='hearto' />
                </TouchableOpacity>
            )}
            {sessionId !== undefined && likedState.ids.includes(sessionId) && (
                <TouchableOpacity onPress={() => handleLike(false)}>
                    <AntDesign size={20} color={'#ff0000'} name='heart' />
                </TouchableOpacity>
            )}
        </>
    )
}

const styles = StyleSheet.create({})