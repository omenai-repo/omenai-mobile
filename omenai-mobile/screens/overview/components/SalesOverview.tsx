import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getSalesActivityData } from 'services/overview/getSalesActivityData';
import { getSalesDataHighestMonth, salesDataAlgorithm, splitNumberIntoChartIndicator } from 'utils/salesDataAlgorithm';

const chartData = [40,20,19,30,45,35]

export default function SalesOverview({refreshCount}: {refreshCount: number}) {
    const [salesOverviewData, setSalesOverviewData] = useState<any[]>([]);
    const [highestNum, setHighestnum] = useState(1);
    const [indicatorArr, setIndicatorArr] = useState([0,1,2,3,4]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        async function handleFetchSalesData(){
            const data = await getSalesActivityData();
            const activityData = salesDataAlgorithm(data.data);

            setSalesOverviewData(activityData)
            const highest = getSalesDataHighestMonth(activityData);
            setHighestnum(highest)
            setIndicatorArr(splitNumberIntoChartIndicator(highest));
            setIsLoading(false)
        }

        handleFetchSalesData()
    }, [refreshCount])
    

    const Bar = ({num}: {num: number}) => {
        let height = (num / highestNum) * 200

        return(
            <View style={{width: 40, justifyContent: 'flex-end', alignItems: 'center'}}>
                <View style={{height: height, width: 22, backgroundColor: '#B5E3C4'}} />
            </View>
        )
    }
    
    if(isLoading)return(
        <View style={styles.container}>
            <Text style={{fontSize: 18, fontWeight: '500'}}>Sales overview</Text>
            <View style={[styles.chartContainer, {height: 250, alignItems: 'center', justifyContent: 'center'}]}><Text>Loading...</Text></View>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 18, fontWeight: '500'}}>Sales overview</Text>
            <View style={styles.chartContainer}>
                <View style={styles.numsIndicator}>
                    {indicatorArr.map((indicator, index) => (
                        <Text style={styles.nums} key={index}>{indicator}</Text>
                    ))}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.mainChart}>
                        <View style={styles.mainChartDisplay}>
                            {salesOverviewData.map((month, index) => (
                                <Bar
                                    num={month.Revenue}
                                    key={index}
                                />
                            ))}
                        </View>
                        <View style={styles.labelContainer}>
                            {salesOverviewData.map((month, index) => (
                                <Text style={styles.label} key={index}>{month.name}</Text>
                            ))}
                        </View>
                    </View>
                </ScrollView>
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
        width: 40,
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center'
    },
    mainChartDisplay: {
        flex: 1,
        paddingHorizontal: 12,
        flexDirection: 'row',
        gap: 10
    }
})