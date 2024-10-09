import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import BalanceBox from "./BalanceBox";
import Transactions from "./Transactions";
import { useModalStore } from "store/modal/modalStore";
import { retrieveBalance } from "services/stripe/retrieveBalance";
import { colors } from "config/colors.config";
import { fetchTransactions } from "services/transactions/fetchTransactions";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function PayoutDashboard({
  account_id,
  refreshCount,
}: {
  account_id: string;
  refreshCount: number;
}) {
  const { updateModal } = useModalStore();

  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState<
    (TransactionModelSchemaTypes & { createdAt: any; updatedAt: any }[]) | []
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
        setTransactions(transactions_result.data);
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

  if (isLoading)
    return (
      <View style={{ gap: 20, opacity: 0.7 }}>
        <View
          style={{
            height: 200,
            backgroundColor: colors.grey50,
            borderRadius: 15,
          }}
        />
        <View style={{ gap: 10 }}>
          <View
            style={{
              height: 50,
              backgroundColor: colors.grey50,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              height: 50,
              backgroundColor: colors.grey50,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              height: 50,
              backgroundColor: colors.grey50,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <BalanceBox account_id={account_id} balance={balance} />
      <ScrollWrapper
        style={{ flex: 1, marginTop: 15 }}
        showsVerticalScrollIndicator={false}
      >
        <Transactions transactions={transactions} />
        <View style={{ height: 50 }} />
      </ScrollWrapper>
    </View>
  );
}

const styles = StyleSheet.create({});
