import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'
import { useModalStore } from 'store/modal/modalStore'
import CloseButton from 'components/buttons/CloseButton'
import LongBlackButton from 'components/buttons/LongBlackButton'
import LongWhiteButton from 'components/buttons/LongWhiteButton'
import { deleteArtwork } from 'services/artworks/deleteArtwork'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'

export default function DeleteArtworkButton({art_id}: {art_id: string}) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { updateConfirmationModal, clear, updateModal} = useModalStore();

    const [loading, setLoading] = useState<boolean>(false);

    const openConfirmModal = () => {
        updateConfirmationModal({child: <DeleteModal />})
    };

    const handleDelete = async () => {
        setLoading(true)
        clear()
        const deleteArtworkData = await deleteArtwork(art_id);
        if(deleteArtworkData?.isOk){
            updateModal({message: "Artwork successfully deleted", modalType: 'success', showModal: true})
            returnToListing()
        }else{
            updateModal({message: "Error deleting artwork, try again later", modalType: 'error', showModal: true})
        }
        setLoading(false)
    };

    const returnToListing = () => {
        setTimeout(() => {
            navigation.navigate(screenName.gallery.artworks)
        }, 3500);
    }

    const DeleteModal = () => {
        return(
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Text style={{fontSize: 16, flex: 1}}>Confirm</Text>
                    <CloseButton handlePress={clear} />
                </View>
                <View style={{marginTop: 20, marginBottom: 20}}>
                    <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>Are you sure you want to delete artwork?</Text>
                    <View style={{gap: 10, marginTop: 20}}>
                        <LongBlackButton value='Yes, delete' onClick={handleDelete} />
                        <LongWhiteButton value='Cancel' onClick={clear} />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={openConfirmModal} activeOpacity={1}>
            {loading ?
                <View style={styles.container}>
                    <Text style={{fontSize: 16, color: colors.primary_black}}>Deleting ...</Text>
                </View>
            :
                <View style={styles.container}>
                    <Text style={{fontSize: 16, color: '#ff0000'}}>Delete artwork</Text>
                    <Feather name='trash-2' size={18} color={'#ff0000'} />
                </View>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 7,
        gap: 10
    }
})