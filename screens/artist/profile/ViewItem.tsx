import React from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';

export default function ViewItem({
  title,
  value,
  isDownloadable = false,
}: {
  title: string;
  value: string;
  isDownloadable?: boolean;
}) {
  const { updateModal } = useModalStore();
  const downloadFile = async () => {
    if (!value) {
      updateModal({
        message: 'No file URL provided',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    try {
      // Check if the URL is valid
      if (!value.startsWith('http')) {
        throw new Error('Invalid URL format');
      }

      // Extract filename from URL or create a default one
      let filename = value.split('/').pop() || 'downloaded_file';

      // Ensure filename has an extension (default to .pdf if none found)
      if (!filename.includes('.')) {
        const contentType = await getContentType(value);
        const extension = contentType.split('/').pop() || 'pdf';
        filename = `${filename}.${extension}`;
      }

      // Clean up filename by removing query parameters
      filename = filename.split('?')[0];

      const downloadPath = `${FileSystem.documentDirectory}${filename}`;

      // Check if file already exists
      const fileInfo = await FileSystem.getInfoAsync(downloadPath);
      if (fileInfo.exists) {
        Alert.alert(
          'File Exists',
          'This file already exists. Would you like to download it again?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Download', onPress: () => performDownload(value, downloadPath) },
          ],
        );
        return;
      }

      await performDownload(value, downloadPath);
    } catch (err: any) {
      updateModal({
        message: err.message || 'Failed to download the file.',
        showModal: true,
        modalType: 'error',
      });
    }
  };

  const performDownload = async (url: string, path: string) => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        path,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        },
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult) {
        throw new Error('Download failed: No result returned.');
      }

      if (Platform.OS === 'ios' || (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Download Complete', `File saved to: ${downloadResult.uri}`);
      }
    } catch (err) {
      throw err;
    }
  };

  const getContentType = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.headers.get('Content-Type') || 'application/pdf';
    } catch {
      return 'application/pdf';
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
          <TouchableOpacity
            style={tw`px-3 py-1 bg-black rounded-[8px]`}
            onPress={downloadFile}
            disabled={!value}
          >
            <Text style={tw`text-white text-xs`}>Download</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
