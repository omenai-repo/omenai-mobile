import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import NavBtnComponent from 'components/artwork/NavBtnComponent';
import { RecentOrderContainer } from 'screens/artist/overview/ArtistOverview';
import { useQuery } from '@tanstack/react-query';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { QK } from 'utils/queryKeys';
import { useAppStore } from 'store/app/appStore';

export default function RecentOrders({
  onLoadingChange,
}: {
  onLoadingChange?: (l: boolean) => void;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [openSection, setOpenSection] = useState<{ [key: string]: boolean }>({});
  const { userSession } = useAppStore();

  const query = useQuery({
    queryKey: QK.overviewOrders(userSession?.id),
    queryFn: async () => {
      const res = await getOverviewOrders();
      return res?.isOk ? res.data : [];
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const data = query.data ?? [];
  const isLoading = query.isLoading && !query.data;

  const toggleRecentOrder = (key: string) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '500', flex: 1, color: '#000' }}>
            Recent orders
          </Text>
          <Feather name="chevron-right" size={20} style={{ opacity: 0.5 }} />
        </View>
        <View style={{ gap: 20, marginTop: 20 }}>
          {[0, 1].map((i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 20 }}>
              <View style={{ height: 100, width: 100, backgroundColor: colors.grey50 }} />
              <View>
                <View
                  style={{ height: 20, backgroundColor: colors.grey50, width: 170, marginTop: 20 }}
                />
                <View
                  style={{ height: 20, backgroundColor: colors.grey50, width: 100, marginTop: 10 }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(screenName.gallery.orders)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '500', flex: 1, color: '#000' }}>
            Recent orders
          </Text>
          <NavBtnComponent onPress={() => {}} />
        </View>
      </TouchableOpacity>

      <View style={styles.mainContainer}>
        {data.length > 0 &&
          data.map((item: any, index: number) => (
            <RecentOrderContainer
              key={index}
              id={index}
              url={item.artwork_data.url}
              open={openSection[item.artwork_data._id]}
              setOpen={() => toggleRecentOrder(item.artwork_data._id)}
              artId={item.order_id}
              artName={item.artwork_data.title}
              buyerName={item.buyer_details.name}
              price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
              status={item.status}
              lastId={index === data.length - 1}
            />
          ))}

        {data.length < 1 && (
          <View style={{ flexWrap: 'wrap', marginRight: 'auto', marginLeft: 'auto' }}>
            <View style={styles.pendingButton}>
              <Text>No pending orders</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10 },
  mainContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#00000033',
    borderRadius: 20,
    padding: 15,
    gap: 20,
  },
  pendingButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 40,
    marginVertical: 80,
  },
});
