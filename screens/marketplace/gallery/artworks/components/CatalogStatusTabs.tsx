import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export type CatalogTab = "live" | "pending";

type CatalogStatusTabsProps = {
  selectedTab: CatalogTab;
  onSelectTab: (tab: CatalogTab) => void;
  liveCount: number;
  pendingCount: number;
  pendingNeedsAction: boolean;
};

export default function CatalogStatusTabs({
  selectedTab,
  onSelectTab,
  liveCount,
  pendingCount,
  pendingNeedsAction,
}: Readonly<CatalogStatusTabsProps>) {
  return (
    <View style={tw`flex-row items-start border-b border-neutral-200`}>
      <Pressable onPress={() => onSelectTab("live")} style={tw`pt-0.5 pr-8`}>
        <View style={tw`h-[24px] justify-center`}>
          <Text
            numberOfLines={1}
            style={[
              tw`text-[13px] font-sans-medium`,
              { color: selectedTab === "live" ? colors.black : colors.grey },
            ]}
          >
            Live ({liveCount})
          </Text>
        </View>
        <View
          style={[
            tw`h-[2px] rounded-full mt-2`,
            {
              backgroundColor:
                selectedTab === "live" ? colors.black : "transparent",
            },
          ]}
        />
      </Pressable>

      <Pressable onPress={() => onSelectTab("pending")} style={tw`pt-0.5`}>
        <View style={tw`h-[24px] flex-row items-center`}>
          <Text
            numberOfLines={1}
            style={[
              tw`text-[13px] font-sans-medium`,
              { color: selectedTab === "pending" ? colors.black : colors.grey },
            ]}
          >
            Pending Approval ({pendingCount})
          </Text>
          {pendingNeedsAction && (
            <View
              style={[
                tw`ml-2 px-2 py-0.5 rounded-full flex-row items-center`,
                {
                  backgroundColor: colors.amber50,
                  borderColor: colors.amber200,
                  borderWidth: 1,
                },
              ]}
            >
              <View
                style={[
                  tw`w-1.5 h-1.5 rounded-full mr-1.5`,
                  { backgroundColor: "#B45309" },
                ]}
              />
              <Text style={tw`text-[10px] font-sans-medium text-amber-700`}>
                Action Required
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            tw`h-[2px] rounded-full mt-2`,
            {
              backgroundColor:
                selectedTab === "pending" ? colors.black : "transparent",
            },
          ]}
        />
      </Pressable>
    </View>
  );
}
