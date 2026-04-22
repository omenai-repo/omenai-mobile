import React, { useMemo } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { GalleryEventRecord, manageEventVipToken } from "#services/events/events.service";
import { EVENTS_QK } from "#utils/queryKeys";

type VipEarlyAccessSectionProps = {
  event: GalleryEventRecord;
};

export default function VipEarlyAccessSection({
  event,
}: VipEarlyAccessSectionProps) {
  const queryClient = useQueryClient();
  const vipMutation = useMutation({
    mutationFn: (action: "generate" | "revoke") => {
      if (!event.gallery_id) {
        throw new Error("Missing gallery id for this event.");
      }
      return manageEventVipToken(event.event_id, event.gallery_id, action);
    },
    onSuccess: async (result, action) => {
      if (!result.isOk) {
        Alert.alert("VIP Access", result.message || "Failed to update VIP access.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.details(event.event_id, "show") });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.details(event.event_id, "event") });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allShows });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allFairsEvents("all") });
      Alert.alert(
        "VIP Access Updated",
        action === "generate" ? "VIP access link generated." : "VIP access revoked.",
      );
    },
    onError: (error: any) => {
      Alert.alert("VIP Access", error?.message || "Failed to update VIP access.");
    },
  });

  const vipPublicLink = useMemo(() => {
    if (!event.vip_access_token) return "";
    const baseWebUrl = (process.env.EXPO_PUBLIC_WEB_URL || "https://omenai.app").replace(/\/$/, "");
    return `${baseWebUrl}/shows/${event.event_id}?vip=${event.vip_access_token}`;
  }, [event.event_id, event.vip_access_token]);

  const handleCopyVipLink = async () => {
    if (!vipPublicLink) {
      Alert.alert("VIP Link", "Generate a VIP link first.");
      return;
    }
    await Clipboard.setStringAsync(vipPublicLink);
    Alert.alert("Copied", "VIP link copied to clipboard.");
  };

  return (
    <View style={tw`bg-white rounded-md border border-neutral-200 p-3 mb-4`}>
      <View style={tw`flex-row items-center gap-2 mb-1`}>
        <Ionicons name="key-outline" size={14} color={colors.black} />
        <Text style={[tw`text-[10px] uppercase tracking-widest`, { color: colors.black }]}>
          VIP Early Access Link
        </Text>
      </View>
      <Text style={tw`text-xs text-neutral-500 mb-3`}>
        Generate a private link to bypass the opening date restriction for top collectors.
      </Text>

      {!event.vip_access_token ? (
        <TouchableOpacity
          style={tw`self-start px-3 py-2 bg-black rounded-sm`}
          activeOpacity={0.85}
          onPress={() => vipMutation.mutate("generate")}
          disabled={vipMutation.isPending}
        >
          <Text style={tw`text-[10px] uppercase tracking-widest text-white`}>
            {vipMutation.isPending ? "Generating..." : "Generate Link"}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={tw`flex-row items-center gap-2`}>
          <View style={tw`flex-1 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-sm`}>
            <Text numberOfLines={1} style={tw`text-[11px] text-neutral-500`}>
              .../shows/{event.event_id}?vip={event.vip_access_token.substring(0, 8)}...
            </Text>
          </View>

          <TouchableOpacity
            style={tw`p-2 bg-white border border-neutral-300 rounded-sm`}
            activeOpacity={0.8}
            onPress={handleCopyVipLink}
          >
            <Ionicons name="copy-outline" size={15} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`p-2 bg-white border border-red-200 rounded-sm`}
            activeOpacity={0.8}
            onPress={() => vipMutation.mutate("revoke")}
            disabled={vipMutation.isPending}
          >
            {vipMutation.isPending ? (
              <ActivityIndicator size="small" color={tw.color("red-500")} />
            ) : (
              <MaterialIcons name="block" size={15} color={tw.color("red-500")} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
