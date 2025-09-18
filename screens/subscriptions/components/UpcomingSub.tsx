import React, { useMemo } from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { getFutureDate } from 'utils/utils_getFutureDate';
import { screenName } from 'constants/screenNames.constants';

export type UpcomingSubData = {
  status: SubscriptionModelSchemaTypes['status'];
  expiry_date: SubscriptionModelSchemaTypes['expiry_date'];
  next_charge_params: SubscriptionModelSchemaTypes['next_charge_params'];
  createdAt: string;
  updatedAt: string;
};

type Props = {
  sub_data: UpcomingSubData;
  logoSource?: any;
};

export default function UpcomingSub({ sub_data, logoSource }: Props) {
  const navigation = useNavigation<any>();
  const { status, next_charge_params, expiry_date } = sub_data;

  const currencySymbol = utils_getCurrencySymbol?.(next_charge_params.currency) ?? '';
  const price = useMemo(() => {
    const n = Number(next_charge_params.value);
    return utils_formatPrice?.(n, currencySymbol) ?? `${currencySymbol}${n.toFixed(2)}`;
  }, [next_charge_params.value, currencySymbol]);

  const isEnded = status === 'canceled' || status === 'expired';
  const isActive = status === 'active';

  return (
    <View style={[tw`w-full`, {}]}>
      <View
        style={[
          tw`bg-white rounded-2xl border border-slate-200 overflow-hidden`,
          tw`h-auto`, // height grows with content
          shadow(),
        ]}
      >
        {/* Header */}
        <View style={tw`px-5 py-4 border-b border-slate-200 bg-slate-50`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="calendar" size={18} color="#475569" style={tw`mr-2`} />
              <Text style={tw`text-slate-900 font-semibold`}>Upcoming Billing</Text>
            </View>
            {isActive && (
              <View style={tw`px-2.5 py-0.5 rounded-full bg-green-100`}>
                <Text style={tw`text-green-700 text-xs font-medium`}>Active</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={tw`p-5`}>
          {isEnded ? (
            // Ended state
            <View style={tw`items-center justify-center py-8`}>
              <View style={tw`p-3 rounded-full bg-red-100 mb-3`}>
                <Ionicons name="alert-circle" size={28} color="#dc2626" />
              </View>
              <Text style={tw`text-base font-semibold text-red-600 capitalize`}>
                Subscription {status}
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate(screenName.gallery.billing, { plan_action: 'reactivation' })
                }
                style={({ pressed }) =>
                  tw.style(
                    `mt-5 px-5 h-11 rounded-lg items-center justify-center bg-slate-900`,
                    pressed ? 'opacity-90' : '',
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Reactivate Subscription"
              >
                <Text style={tw`text-white text-sm font-medium`}>Reactivate Subscription</Text>
              </Pressable>
            </View>
          ) : (
            // Active state
            <View style={tw`gap-4`}>
              {/* Plan details */}
              <View style={tw`flex-row items-start justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`p-2 bg-slate-100 rounded-lg mr-3`}>
                    {logoSource ? (
                      <Image source={logoSource} style={tw`w-6 h-6`} resizeMode="contain" />
                    ) : (
                      <Ionicons name="sparkles" size={20} color="#334155" />
                    )}
                  </View>
                  <View>
                    <Text style={tw`text-slate-900 font-semibold`}>
                      Omenai {next_charge_params.type}
                    </Text>
                    <Text style={tw`text-slate-600 text-xs capitalize`}>
                      {next_charge_params.interval} billing
                    </Text>
                  </View>
                </View>

                <View style={tw`items-end`}>
                  <Text style={tw`text-slate-900 text-lg font-bold`}>{price}</Text>
                </View>
              </View>

              {/* Billing period card */}
              <View style={tw`p-4 rounded-lg bg-blue-50 border border-blue-200`}>
                <View style={tw`flex-row`}>
                  <Ionicons name="time-outline" size={18} color="#2563eb" style={tw`mr-3 mt-0.5`} />
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-blue-900 text-sm`}>
                      <Text style={tw`font-medium`}>Next billing: </Text>
                      {formatIntlDateTime?.(expiry_date) ?? new Date(expiry_date).toLocaleString()}
                    </Text>
                    <Text style={tw`text-blue-700 text-sm mt-1`}>
                      <Text style={tw`font-medium`}>Period ends: </Text>
                      {getFutureDate?.(
                        expiry_date,
                        next_charge_params.interval as 'monthly' | 'yearly',
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ---- helpers

function shadow() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 3 },
    default: {},
  });
}
