import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { utils_handleFetchUserID } from 'utils/utils_asyncStorage';
import useLikedState from 'custom/hooks/useLikedState';
import { SvgXml } from 'react-native-svg';
import { heartIcon } from 'utils/SvgImages';
import tw from 'twrnc';

type SaveArtworkButtonProps = {
  likeIds: string[];
  art_id: string;
  impressions: number;
};

export default function SaveArtworkButton({
  likeIds,
  art_id,
  impressions,
}: SaveArtworkButtonProps) {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    handleFetchUserSessionData();
  }, []);

  const handleFetchUserSessionData = async () => {
    const userId = await utils_handleFetchUserID();
    setSessionId(userId);
  };

  const { likedState, handleLike } = useLikedState(impressions, likeIds, sessionId, art_id);

  return (
    <>
      {(sessionId === undefined || (sessionId && !likedState.ids.includes(sessionId))) && (
        <TouchableOpacity onPress={() => handleLike(true)}>
          <View style={styles.likeContainer}>
            <View style={styles.tagItem}>
              <SvgXml xml={heartIcon} />
              <Text style={tw`text-[17px] text-[#1A1A1A]`}>Save artwork to favorites</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {sessionId !== undefined && likedState.ids.includes(sessionId) && (
        <TouchableOpacity onPress={() => handleLike(false)}>
          <View style={styles.likeContainer}>
            <View style={styles.tagItem}>
              <AntDesign color={'#ff0000'} name="heart" />
              <Text style={tw`text-[17px] text-[#1A1A1A]`}>Remove from saved</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  likeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    height: 55,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    width: '100%',
  },
});
