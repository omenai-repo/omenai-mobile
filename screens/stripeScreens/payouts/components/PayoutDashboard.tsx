import { View } from "react-native";
import React, { useEffect, useState } from "react";
import BalanceBox from "./BalanceBox";
import Transactions from "./Transactions";
import { useModalStore } from "#store/modal/modalStore";
import { retrieveBalance } from "#services/stripe/retrieveBalance";
import { fetchTransactions } from "#services/transactions/fetchTransactions";
import ScrollWrapper from "#components/general/ScrollWrapper";
import PayoutSummary from "./PayoutSummary";
import PayoutSkeleton from "#components/skeleton/PayoutSkeleton";

type TransactionsTableProps = {
  transactions: (PurchaseTransactionModelSchemaTypes & {
    createdAt: string;
    updatedAt: string;
  })[];
};

export default function PayoutDashboard({
  account_id,
  refreshCount,
}: {
  account_id: string;
  refreshCount: number;
}) {
  const { updateModal } = useModalStore();

  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState<
    (PurchaseTransactionModelSchemaTypes & {
      createdAt: string;
      updatedAt: string;
    })[]
  >([]);

  useEffect(() => {
    async function handleFetchBalance() {
      setIsLoading(true);
      const balance_result = await retrieveBalance(account_id);
      if (balance_result?.isOk) {
        setBalance(balance_result.data);
      } else {
        updateModal({
          message: "Something went wrong, please try again or contact support",
          modalType: "error",
          showModal: true,
        });
      }

      const transactions_result = await fetchTransactions();
      if (transactions_result?.isOk) {
        setTransactions(
          transactions_result.data.map(
            (
              transaction: PurchaseTransactionModelSchemaTypes & {
                createdAt: string;
                updatedAt: string;
              },
            ) => ({
              ...transaction,
              createdAt: String(transaction.createdAt),
              updatedAt: String(transaction.updatedAt),
            }),
          ),
        );
      } else {
        updateModal({
          message: "Something went wrong, please try again or contact support",
          modalType: "error",
          showModal: true,
        });
      }

      setIsLoading(false);
    }

    handleFetchBalance();
  }, [refreshCount]);

  if (isLoading) return <PayoutSkeleton withHeader={false} />;

  return (
    <View style={{ flex: 1 }}>
      <PayoutSummary transactions={transactions} />
      <View style={{ marginBottom: 20 }}>
        <BalanceBox account_id={account_id} balance={balance} />
      </View>

      <ScrollWrapper
        style={{ flex: 1, marginTop: 5 }}
        showsVerticalScrollIndicator={false}
      >
        <Transactions transactions={transactions} />
        <View style={{ height: 200 }} />
      </ScrollWrapper>
    </View>
  );
}
