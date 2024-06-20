import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const chartData = [40,20,19,30,45,35]

export default function SalesOverview() {

    const Bar = ({num}: {num: number}) => {
        let height = (num / 50) * 200

        return(
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <View style={{height: height, width: 22, backgroundColor: '#B5E3C4'}} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 18, fontWeight: '500'}}>Sales overview</Text>
            <View style={styles.chartContainer}>
                <View style={styles.numsIndicator}>
                    <Text style={styles.nums}>50k</Text>
                    <Text style={styles.nums}>40k</Text>
                    <Text style={styles.nums}>30k</Text>
                    <Text style={styles.nums}>20k</Text>
                    <Text style={styles.nums}>10k</Text>
                    <Text style={styles.nums}>5k</Text>
                </View>
                <View style={styles.mainChart}>
                    <View style={styles.mainChartDisplay}>
                        {chartData.map((i, index) => (
                            <Bar
                                num={i}
                                key={index}
                            />
                        ))}
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Jan</Text>
                        <Text style={styles.label}>Feb</Text>
                        <Text style={styles.label}>Mar</Text>
                        <Text style={styles.label}>Apr</Text>
                        <Text style={styles.label}>May</Text>
                        <Text style={styles.label}>Jun</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    chartContainer: {
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        marginTop: 20,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 15
    },
    numsIndicator: {
        width: 30,
        gap: 20,
        justifyContent: 'flex-end',
        paddingBottom: 20
    },
    mainChart: {
        flex: 1,
    },
    nums: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'right'
    },
    labelContainer: {
        flexDirection: 'row',
        gap: 10,
        height: 20,
        paddingTop: 5,
        paddingHorizontal: 12
    },
    label: {
        flex: 1,
        fontSize: 14,
        opacity: 0.6
    },
    mainChartDisplay: {
        flex: 1,
        paddingHorizontal: 12,
        flexDirection: 'row',
        gap: 10
    }
})