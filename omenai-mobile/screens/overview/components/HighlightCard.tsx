import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchHighlightData } from "services/overview/fetchHighlightData";

type HighlightCardProps = {
    name: string,
    type: "artworks" | "sales",
    refreshCount: number
}

export const HighlightCard = ({name, type, refreshCount}: HighlightCardProps) => {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        handleFetchHighlightData()
    }, [refreshCount]);

    const handleFetchHighlightData = async () => {
        setAmount(0)
        let results = await fetchHighlightData(type);
        setAmount(results)
    }

    return(
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                {type === "artworks" ? 
                    <Ionicons name='document-text-outline' size={21} color={colors.white}/>
                    :
                    <FontAwesome name='dollar' size={21} color={colors.white}/>
                }
            </View>
            <Text style={styles.cardTitle}>{name}</Text>
            <View style={styles.statsDisplay}>
                <Text style={styles.cardAmount}>{amount}</Text>
                {/* <View style={styles.percentageContainer}>
                    <Text style={styles.percentageNumber}>{percentage}</Text>
                </View> */}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 15
    },
    iconContainer: {
        height: 40,
        width: 40,
        borderRadius: 4,
        backgroundColor: colors.primary_black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardTitle: {
        color: '#1a1a1a',
        fontSize: 12,
        marginTop: 15
    },
    cardAmount: {
        fontSize: 18,
        fontWeight: '500',
        flex: 1
    },
    statsDisplay: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    percentageContainer: {
        backgroundColor: '#E7F6EC',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    percentageNumber: {
        color: '#0F973D',
        fontSize: 14,
        fontWeight: '500'
    }
})