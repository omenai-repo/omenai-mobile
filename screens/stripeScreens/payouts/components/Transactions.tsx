import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TransactionCard from './TransactionCard';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { convertPriceStringToNumber } from 'utils/utils_priceStringToNumberConverter';

type TransactionsTableProps = {
  transactions: (PurchaseTransactionModelSchemaTypes & {
    createdAt: string;
    updatedAt: string;
  })[];
};

export default function Transactions({ transactions }: TransactionsTableProps) {
  const transaction_table_data = transactions.map(
    (
      transaction: PurchaseTransactionModelSchemaTypes & {
        createdAt: any;
        updatedAt: string;
      },
    ) => {
      const table = {
        id: transaction.trans_id,
        date: formatIntlDateTime(transaction.trans_date),
        gross: utils_formatPrice(transaction.trans_pricing.unit_price),
        net: utils_formatPrice(
          transaction.trans_pricing.unit_price - transaction.trans_pricing.commission,
        ),
        commission: transaction.trans_pricing.commission,
        status: 'Completed',
      };
      return table;
    },
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16 }}>Transactions</Text>
      <View style={styles.listing}>
        {transaction_table_data.map((data, index) => (
          <TransactionCard
            id={data.id}
            gross={data.gross} //fix gross
            net={data.net}
            key={index}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  listing: {
    gap: 20,
    marginTop: 20,
  },
});
