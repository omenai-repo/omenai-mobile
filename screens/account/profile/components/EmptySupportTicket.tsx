import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import tw from "twrnc";

export function EmptySupportTicket() {
    return (
        <View style={tw`items-center justify-center mt-20`}>
            <View
                style={tw`w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4`}
            >
                <Ionicons
                    name="file-tray-outline"
                    size={32}
                    color="#9CA3AF"
                />
            </View>
            <Text style={tw`text-gray-900 font-semibold mb-1`}>
                No tickets found
            </Text>
            <Text style={tw`text-gray-500 text-sm`}>
                Try adjusting your filters
            </Text>
        </View>
    )
}
