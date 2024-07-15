import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TransactionCard from './TransactionCard'
import { formatPrice } from 'utils/priceFormatter'
import { formatIntlDateTime } from 'utils/formatIntlDateTime'
import { convertPriceStringToNumber } from 'utils/priceStringToNumberConverter'

type TransactionsTableProps = {
    transactions: TransactionModelSchemaTypes & { createdAt: any; updatedAt: any }[] | []
}

export default function Transactions({transactions}: TransactionsTableProps) {

    const transaction_table_data = transactions.map((transaction: any) => {
        const priceNumber =
          convertPriceStringToNumber(transaction.trans_amount) * 0.7;
        const table = {
          id: transaction.trans_id,
          date: formatIntlDateTime(transaction.trans_date),
          gross: transaction.trans_amount,
          net: formatPrice(priceNumber),
          type: "Incoming",
          status: "Completed",
        };
    
        return table;
    });

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 16}}>Transactions</Text>
            <View style={styles.listing}>
                {transaction_table_data.map((data, index) => (
                    <TransactionCard
                        id={data.id}
                        gross={data.gross}
                        net={data.net}
                        key={index}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30
    },
    listing: {
        gap: 20,
        marginTop: 20
    }
})