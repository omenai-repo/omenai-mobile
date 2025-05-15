import React from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import tw from 'twrnc';

export default function ViewItem({
  title,
  value,
  isDownloadable = false,
}: {
  title: string;
  value: string;
  isDownloadable?: boolean;
}) {
  const downloadFile = async () => {
    try {
      const filename = value.split('/').pop() || 'file.pdf';
      const downloadPath = `${FileSystem.documentDirectory}${filename}`;

      const downloadResumable = FileSystem.createDownloadResumable(value, downloadPath);
      const downloadResult = await downloadResumable.downloadAsync();
      if (!downloadResult) {
        throw new Error('Download failed: No result returned.');
      }
      const { uri } = downloadResult;

      if (Platform.OS === 'ios' || (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Download Complete', `File saved to: ${uri}`);
      }
    } catch (err) {
      console.error('Download failed:', err);
      Alert.alert('Error', 'Failed to download the file.');
    }
  };

  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-[#1A1A1A] text-[14px] font-bold mb-1`}>{title}</Text>
      <View style={tw`flex-row justify-between items-center bg-[#F4F4F4] rounded-[10px] p-3`}>
        <Text style={tw`text-[13px] text-[#333] flex-1 mr-2`} numberOfLines={1}>
          {value}
        </Text>
        {isDownloadable && (
          <TouchableOpacity style={tw`px-3 py-1 bg-black rounded-[8px]`} onPress={downloadFile}>
            <Text style={tw`text-white text-xs`}>Download</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
