import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CloseButton from 'components/buttons/CloseButton';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { Entypo } from '@expo/vector-icons';
import { deleteGalleryAccount } from 'services/requests/deleteGalleryAccount';

export default function DeleteAccountModal() {
  const { clear } = galleryOrderModalStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDeleteGalleryAccount() {
    setLoading(true);
    const response = await deleteGalleryAccount();

    if (response?.isOk) {
      setDeleted(true);
    }
    setLoading(false);
  }

  if (deleted)
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Gallery account deleted successfuflly
        </Text>
      </View>
    );

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Confirm Account Deletion</Text>
        <CloseButton handlePress={clear} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: 500, color: '#ff0000', marginTop: 10 }}>
        You are about to delete your Gallery account!
      </Text>
      <View style={styles.warningContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Entypo size={18} color={'#FFA500'} name="warning" />
          <Text style={{ fontSize: 14, fontWeight: 500, color: '#FFA500' }}>Warning</Text>
        </View>
        <Text
          style={{ fontSize: 14, marginTop: 10, lineHeight: 20 }}
        >{`Deleting your account will permanently erase all your uploaded artwork and prevent you from using any of the platform's features. This action is not reversible!`}</Text>
      </View>
      <View style={{ gap: 20, marginTop: 30 }}>
        <LongBlackButton
          onClick={handleDeleteGalleryAccount}
          value={loading ? 'Deleting account ...' : 'I understand, delete this account'}
          style={{ backgroundColor: "#ff0000" }}
          isLoading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  warningContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#FDF7EF',
  },
});
