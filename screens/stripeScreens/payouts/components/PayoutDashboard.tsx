import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import BalanceBox from './BalanceBox';
import Transactions from './Transactions';
import { useModalStore } from 'store/modal/modalStore';
import { retrieveBalance } from 'services/stripe/retrieveBalance';
import { colors } from 'config/colors.config';
import { fetchTransactions } from 'services/transactions/fetchTransactions';
import ScrollWrapper from 'components/general/ScrollWrapper';

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
    (PurchaseTransactionModelSchemaTypes & {
      createdAt: string;
      updatedAt: string;
    })[]
  >([]);

  useEffect(() => {
    async function handleFetchBalance() {
      setIsLoading(true);
      try {
        const balance_result = await retrieveBalance(account_id);
        if (!balance_result?.isOk) {
          Sentry.setContext('stripeBalance', {
            account_id,
            response: balance_result,
          });
          Sentry.captureMessage(`retrieveBalance failed for account ${account_id}`, 'error');

          updateModal({
            message: 'Something went wrong, please try again or contact support',
            modalType: 'error',
            showModal: true,
          });
        } else {
          setBalance(balance_result.data);
        }

        // Breadcrumb before fetching transactions
        Sentry.addBreadcrumb({
          category: 'network',
          message: 'fetchTransactions called',
          level: 'info',
        });

        const transactions_result = await fetchTransactions();
        // console.log(transactions_result);
        if (!transactions_result?.isOk) {
          Sentry.setContext('transactionsFetch', {
            response: transactions_result,
          });
          Sentry.captureMessage('fetchTransactions returned non-ok response', 'error');

          updateModal({
            message: 'Something went wrong, please try again or contact support',
            modalType: 'error',
            showModal: true,
          });
        } else {
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
        }
      } catch (error: any) {
        // capture unexpected errors
        Sentry.setContext('payoutDashboardCatch', { account_id, refreshCount });
        Sentry.addBreadcrumb({
          category: 'exception',
          message: 'Unhandled error in PayoutDashboard handleFetchBalance',
          level: 'error',
        });
        Sentry.captureException(error);

        updateModal({
          message: 'Something went wrong, please try again or contact support',
          modalType: 'error',
          showModal: true,
        });
      } finally {
        setIsLoading(false);
      }
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
      <ScrollWrapper style={{ flex: 1, marginTop: 15 }} showsVerticalScrollIndicator={false}>
        <Transactions transactions={transactions} />
        <View style={{ height: 200 }} />
      </ScrollWrapper>
    </View>
  );
}

const styles = StyleSheet.create({});
