import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import UploadImageInput from 'components/inputs/UploadImageInput'
import LongBlackButton from 'components/buttons/LongBlackButton';
import * as ImagePicker from 'expo-image-picker';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';

export default function UploadImage({handleUpload}: {handleUpload: () => void}) {
    const {image, setImage} = uploadArtworkStore();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
    
        // console.log(result);
    
        if (!result.canceled) {
          setImage(result);
        }
      };

    return (
        <View style={styles.container}>
            <View style={{marginBottom: 40}}>
                {!image &&
                    <UploadImageInput
                        label='Upload image'
                        handlePress={pickImage}
                    />
                }
                {image && <Image source={{ uri: image.assets[0].uri }} style={styles.image} />}
            </View>

            <View style={styles.buttonsContainer}>
            {image &&
                <LongWhiteButton 
                    value='Change image'
                    onClick={pickImage}
                />
            }
            <LongBlackButton
                value='Proceed'
                onClick={handleUpload}
                isLoading={false}
                isDisabled={image === null}
            />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 100
    },
    image: {
        height: 340,
        width: '100%',
        objectFit: 'contain'
    },
    buttonsContainer: {
        gap: 20,
    }
})