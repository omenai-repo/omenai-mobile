import React, { useState } from "react";
import { View, Text, Alert, Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import tw from "twrnc";
import { useModalStore } from "#store/account/modal/modalStore";
import FittedBlackButton from "#components/buttons/FittedBlackButton";

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
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = async () => {
    if (!value) {
      updateModal({
        message: "No file URL provided",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if the URL is valid
      if (!value.startsWith("http")) {
        throw new Error("Invalid URL format");
      }

      // Check file existence and get content type
      const { exists, contentType } = await checkFileUrl(value);
      if (!exists) {
        throw new Error("File not found on server (404)");
      }

      // Extract filename from URL or create a default one
      let filename = value.split("/").pop() || "downloaded_file";

      // Ensure filename has an extension (default to .pdf if none found)
      if (!filename.includes(".")) {
        const extension = contentType.split("/").pop() || "pdf";
        filename = `${filename}.${extension}`;
      }

      // Clean up filename by removing query parameters
      filename = filename.split("?")[0];

      const file = new File(Paths.cache, filename);

      // Always perform path cleanup and new download (simulating 'clear cache' / force re-download)
      await performDownload(value, file);
    } catch (err: any) {
      updateModal({
        message: err.message || err?.body?.message || "Failed to download the file.",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performDownload = async (url: string, file: File) => {
    try {
      if (file.exists) {
        await file.delete();
      }

      await File.downloadFileAsync(url, file);

      if (Platform.OS === "ios" || (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/pdf",
          dialogTitle: title || "Document",
        });
      } else {
        Alert.alert("Download Complete", `File saved to: ${file.uri}`);
      }
    } catch (err) {
      throw err;
    }
  };

  const checkFileUrl = async (
    url: string,
  ): Promise<{ exists: boolean; contentType: string }> => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.status === 404) {
        return { exists: false, contentType: "" };
      }
      return {
        exists: true,
        contentType: response.headers.get("Content-Type") || "application/pdf",
      };
    } catch {
      return { exists: false, contentType: "" };
    }
  };

  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-[#1A1A1A] text-sm font-bold mb-1`}>{title}</Text>
      <View
        style={tw`flex-row justify-between items-center bg-[#F4F4F4] rounded-sm p-3`}
      >
        <Text style={tw`text-[13px] text-[#333] flex-1 mr-2`} numberOfLines={1}>
          {title === "CV Document" ? "Pdf file" : value}
        </Text>
        {isDownloadable && (
          <FittedBlackButton
            value="Download"
            onClick={downloadFile}
            isLoading={isLoading}
            isDisabled={!value}
            style={tw`h-[32px] px-3`}
            textStyle={tw`text-xs`}
          />
        )}
      </View>
    </View>
  );
}
