import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from 'config/colors.config';
import { Skeleton } from 'moti/skeleton';
import tw from 'twrnc';
import Divider from 'components/general/Divider';

export default function OrderslistingLoader() {
  const Item = () => (
    <View style={tw`p-[20px]`}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row items-center gap-[10px] flex-1`}>
          {/* Thumbnail */}
          <Skeleton colorMode="light" height={42} width={42} radius={3} />
          <View style={tw`gap-[5px]`}>
            <Skeleton colorMode="light" height={12} width={100} radius={5} />
            <Skeleton colorMode="light" height={14} width={160} radius={5} />
          </View>
        </View>

        <Skeleton colorMode="light" height={35} width={35} radius={8} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[0, 1, 2, 3, 4, 5, 6]}
      renderItem={() => <Item />}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, index) => String(index)}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
