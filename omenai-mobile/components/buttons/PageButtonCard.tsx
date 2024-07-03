import { Feather } from "@expo/vector-icons"
import { colors } from "config/colors.config"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type PageButtonItemProps = {
    name: string,
    subText?: string,
    handlePress: () => void,
    logout?: boolean
}

export const PageButtonCard = ({name, subText, handlePress, logout}: PageButtonItemProps) => {
    return(
        <TouchableOpacity activeOpacity={1} onPress={handlePress}>
            <View style={[styles.pageButtonItem]}>
                <View style={{flex: 1}}>
                    <Text style={[{fontSize: 16, color: colors.primary_black}, logout && {color: '#ff0000'}]}>{name}</Text>
                    {subText && <Text style={{fontSize: 14, color: '#858585', marginTop: 5}}>{subText}</Text>}
                </View>
                <Feather name='chevron-right' color={logout ? '#ff0000' : colors.primary_black} size={15} />
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    pageButtonItem: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: colors.grey50,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})