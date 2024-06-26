import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getSalesActivityData } from 'services/overview/getSalesActivityData';
import { salesDataAlgorithm } from 'utils/salesDataAlgorithm';
import {
    LineChart,
} from "react-native-chart-kit";
import Loader from 'components/general/Loader';

const screenWidth = Dimensions.get("window").width;

export default function SalesOverview({refreshCount}: {refreshCount: number}) {
    const [salesOverviewData, setSalesOverviewData] = useState<number[]>([0]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        async function handleFetchSalesData(){
            const data = await getSalesActivityData();
            const activityData = salesDataAlgorithm(data.data);
            
            let arr : number[] = [];
            activityData.map((month) => (
                arr.push(month.Revenue)
            ))

            setSalesOverviewData(arr)
            setIsLoading(false)
        }

        handleFetchSalesData()
    }, [refreshCount])

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            data: salesOverviewData,
            strokeWidth: 2, // optional,
            color: () => '#808783',
          }
        ],
    };
    
    if(isLoading)return(
        <View style={styles.container}>
            <Text style={{fontSize: 16, fontWeight: '400', paddingHorizontal: 20, marginBottom: 20}}>Sales overview</Text>
            <Loader />
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 16, fontWeight: '400', paddingHorizontal: 20, marginBottom: 20}}>Sales overview</Text>

            <LineChart
                data={data}
                width={screenWidth}
                height={220}
                withDots={false}
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientFromOpacity: 1,
                    backgroundGradientTo: "#fff",
                    backgroundGradientToOpacity: 0.1,
                    labelColor: () => `rgba(0, 0, 0, 0.5)`,
                    color: () => 'rgba(0,0,0, 0.2)',
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false, // optional
                }}
                fromZero={false}
                bezier
                formatYLabel={value => {
                    const num = Number(value)
                    if (num >= 1000) {
                        return Math.ceil(num / 1000) + 'k';
                        }
                        return num.toString();
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0
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