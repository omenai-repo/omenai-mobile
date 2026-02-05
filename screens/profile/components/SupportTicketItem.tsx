import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

interface SupportTicketItemProps {
  item: any;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "OPEN":
      return { bg: "#DBEAFE", text: "#1D4ED8" };
    case "IN_PROGRESS":
      return { bg: "#FEF9C3", text: "#A16207" };
    case "RESOLVED":
      return { bg: "#DCFCE7", text: "#15803D" };
    case "CLOSED":
      return { bg: "#F3F4F6", text: "#374151" };
    default:
      return { bg: "#F3F4F6", text: "#374151" };
  }
};

const getPriorityStyle = (priority: string) => {
  if (priority === "HIGH") {
    return tw`border-red-200 text-red-600 bg-red-50`;
  }
  if (priority === "LOW") {
    return tw`border-blue-200 text-blue-600 bg-blue-50`;
  }
  return tw`border-gray-200 text-gray-600 bg-gray-50`;
};

export const SupportTicketItem = ({ item }: SupportTicketItemProps) => {
  const statusStyle = getStatusStyle(item.status);
  const priorityStyle = getPriorityStyle(item.priority);

  return (
    <View
      style={tw`bg-white p-4 rounded-xl border border-gray-100 mb-3 shadow-sm`}
    >
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <View>
          <View style={tw`bg-gray-100 px-2 py-1 rounded self-start mb-1`}>
            <Text style={tw`text-[10px] uppercase text-gray-500 font-mono`}>
              {item.ticketId}
            </Text>
          </View>
          <Text style={tw`font-semibold text-gray-900 capitalize`}>
            {item.category.replaceAll(/_/g, " ").toLowerCase()}
          </Text>
        </View>
        <View
          style={[
            tw`px-2 py-1 rounded-full`,
            { backgroundColor: statusStyle.bg },
          ]}
        >
          <Text
            style={[
              tw`text-[10px] font-bold uppercase`,
              { color: statusStyle.text },
            ]}
          >
            {item.status.replaceAll(/_/g, " ")}
          </Text>
        </View>
      </View>

      <Text style={tw`text-gray-600 text-sm mb-3 leading-5`} numberOfLines={2}>
        {item.message}
      </Text>

      <View
        style={tw`flex-row justify-between items-center pt-3 border-t border-gray-100`}
      >
        <View style={tw`flex-row items-center gap-1`}>
          <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
          <Text style={tw`text-xs text-gray-500`}>
            {format(new Date(item.createdAt), "MMM d, yyyy")}
          </Text>
        </View>

        <View style={tw`flex-row items-center gap-1`}>
          <Text
            style={[
              tw`text-[10px] font-bold uppercase px-2 py-0.5 rounded border`,
              priorityStyle,
            ]}
          >
            {item.priority}
          </Text>
        </View>
      </View>
    </View>
  );
};
