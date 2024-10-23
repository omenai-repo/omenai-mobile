import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

type DetailItemProps = {
    name: string,
    text: string
}

type DetailCardProps = {
    title: string,
    details: DetailItemProps[]
}

export default function DetailsCard({title, details}: DetailCardProps) {

    const DetailItem = ({name, text}: DetailItemProps) => {
        return(
            <View style={styles.detailItem}>
                <Text style={[styles.detailItemText, {width: 120, fontWeight: '500'}]}>{name}</Text>
                <Text style={[styles.detailItemText, {flex: 1}]}>{text}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}><Text style={styles.title}>{title}</Text></View>
            <View style={styles.mainContainer}>
                {details.map((detail, idx) => (
                    <DetailItem
                        name={detail.name}
                        text={detail.text}
                        key={idx}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    header: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary_black
    },
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        gap: 20
    },
    detailItem: {
        flexDirection: 'row',
        gap: 20
    },
    detailItemText: {
        color: '#858585',
        fontSize: 14,
        lineHeight: 20
    }
})