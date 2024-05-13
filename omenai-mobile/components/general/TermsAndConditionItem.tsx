import { colors } from "../../config/colors.config";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type TermsAndConditionItemProps = {
    writeUp: string,
    isSelected: boolean,
    handleSelect: () => void
}

const TermsAndConditionItem = ({writeUp, isSelected, handleSelect}: TermsAndConditionItemProps) => {
    return(
        <TouchableOpacity style={styles.singleItem} onPress={handleSelect}>
            <View style={styles.tickBox}>{isSelected && <AntDesign name='check' color={colors.primary_black} size={15} />}</View>
            <Text style={styles.writeUp}>{writeUp}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    singleItem: {
        flexDirection: 'row',
        gap: 10
    },
    tickBox: {
        height: 20,
        width: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center'
    },
    writeUp: {
        color: '#858585',
        fontSize: 14,
        flex: 1
    }
})

export default TermsAndConditionItem