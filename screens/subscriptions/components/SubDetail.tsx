import React, { useMemo } from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { daysLeft } from 'utils/utils_daysLeft';
import { screenName } from 'constants/screenNames.constants';

export type SubData = {
  status: SubscriptionModelSchemaTypes['status'];
  expiry_date: SubscriptionModelSchemaTypes['expiry_date'];
  upload_tracker: UploadTrackingTypes;
  plan_details: SubscriptionModelSchemaTypes['plan_details'];
};

type Props = {
  sub_data: SubData;
  onOpenCancelModal?: () => void;
  logoSource?: any;
};

export default function SubDetail({ sub_data, onOpenCancelModal, logoSource }: Props) {
  const navigation = useNavigation<any>();
  const { status, plan_details, upload_tracker, expiry_date } = sub_data;

  // --- date helpers
  const now = new Date();
  const exp = new Date(expiry_date as any);
  const hasExpired = now.getTime() >= exp.getTime(); // end of period reached
  const dLeft = Math.max(0, daysLeft?.(expiry_date) ?? 0);

  // --- derived states
  const isActive = status === 'active';
  const isPendingCancel = status === 'canceled' && !hasExpired; // canceled but still within paid period
  const isEndedPast = (status === 'canceled' && hasExpired) || status === 'expired';

  // --- price label
  const currency_symbol = utils_getCurrencySymbol?.(plan_details.currency) ?? '';
  const price = useMemo(() => {
    const num =
      plan_details.interval === 'monthly'
        ? Number(plan_details.value.monthly_price)
        : Number(plan_details.value.annual_price);
    return utils_formatPrice?.(num, currency_symbol) ?? `${currency_symbol}${num}`;
  }, [plan_details, currency_symbol]);

  // --- usage display
  const usagePercentage = useMemo(
    () => calculateUploadUsagePercentage(upload_tracker.upload_count, upload_tracker.limit),
    [upload_tracker],
  );
  const remainingUploads = useMemo(() => {
    return upload_tracker.limit === Number.MAX_SAFE_INTEGER
      ? 'Unlimited'
      : Math.max(0, upload_tracker.limit - upload_tracker.upload_count).toString();
  }, [upload_tracker]);
  const progressBarColor = useMemo(
    () => getProgressBarColor(upload_tracker.upload_count, upload_tracker.limit),
    [upload_tracker],
  );

  // period progress bar (keep for active + pending-cancel)
  const periodPercent = clamp(Math.max(5, 100 - (dLeft / 30) * 100), 0, 100);

  // --- badge content
  const badgeStyles = isActive
    ? { wrap: tw`bg-green-100`, text: tw`text-green-700` }
    : isPendingCancel
    ? { wrap: tw`bg-amber-100`, text: tw`text-amber-800` }
    : { wrap: tw`bg-red-100`, text: tw`text-red-700` };

  const badgeText = isActive
    ? 'ACTIVE'
    : isPendingCancel
    ? `ACTIVE • ends in ${dLeft} day${dLeft === 1 ? '' : 's'}`
    : 'CANCELED';

  return (
    <View style={[tw`bg-white rounded-xl border border-slate-200 p-4`, shadow()]}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text style={tw`text-base font-semibold text-slate-900`}>Your Subscription</Text>

        <View style={tw.style(`px-2 py-1 rounded-lg`, badgeStyles.wrap)}>
          <Text style={tw.style(`text-xs font-semibold`, badgeStyles.text)}>{badgeText}</Text>
        </View>
      </View>

      {/* Plan + Price */}
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          {!!logoSource && (
            <Image source={logoSource} style={tw`w-5 h-5 mr-2`} resizeMode="contain" />
          )}
          <Text style={tw`text-slate-900 font-medium`}>{plan_details.type} Plan</Text>
        </View>
        <Text style={tw`text-lg font-bold text-slate-900`}>{price}</Text>
      </View>

      {/* Period progress (show for active + pending-cancel) */}
      {(isActive || isPendingCancel) && (
        <View style={tw`mt-3`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <Text style={tw`text-xs text-slate-600`}>Period progress</Text>
            <Text style={tw`text-xs text-slate-600`}>{dLeft} day(s) left</Text>
          </View>
          <View style={tw`h-2 w-full rounded-full bg-slate-200 overflow-hidden`}>
            <View
              style={[
                tw`h-2 rounded-full`,
                { width: `${periodPercent}%`, backgroundColor: '#0f172a' },
              ]}
            />
          </View>
        </View>
      )}

      {/* Usage tracker (show for active + pending-cancel; hide once fully expired) */}
      {(isActive || isPendingCancel) && (
        <View style={tw`mt-3`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <Text style={tw`text-[11px] text-slate-600`}>
              {getUsageDisplayText(upload_tracker.upload_count, upload_tracker.limit)}
            </Text>

            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[11px] text-slate-600`}>
                {upload_tracker.limit === Number.MAX_SAFE_INTEGER
                  ? 'Unlimited'
                  : `${remainingUploads} remaining`}
              </Text>
              {upload_tracker.limit !== Number.MAX_SAFE_INTEGER && (
                <Text style={tw`text-[11px] text-slate-500 ml-1`}>
                  ({Math.round((upload_tracker.upload_count / upload_tracker.limit) * 100)}% used)
                </Text>
              )}
            </View>
          </View>

          <View style={tw`h-2 w-full rounded-full bg-slate-200 overflow-hidden`}>
            <View
              style={tw.style(`h-2 rounded-full`, progressBarColor, {
                width: `${usagePercentage}%`,
              })}
            />
          </View>
        </View>
      )}

      {/* Pending-cancel note */}
      {isPendingCancel && (
        <View style={tw`mt-3 p-3 rounded-md bg-amber-50 border border-amber-200`}>
          <Text style={tw`text-[11px] text-amber-800`}>
            <Text style={tw`font-semibold`}>NOTE:</Text> Your subscription cancellation will take
            effect after your current billing cycle.
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={tw`flex-row mt-4`}>
        {isEndedPast ? (
          <Pressable
            onPress={() => {
              navigation.navigate(screenName.gallery.billing, { plan_action: 'reactivation' });
            }}
            style={({ pressed }) =>
              tw.style(
                `flex-1 h-11 rounded-lg items-center justify-center bg-blue-600`,
                pressed ? 'opacity-90' : '',
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Reactivate plan"
          >
            <Text style={tw`text-white text-sm font-medium`}>Reactivate</Text>
          </Pressable>
        ) : (
          !isPendingCancel && (
            <>
              <Pressable
                onPress={() => navigation.navigate('BillingPlans')}
                style={({ pressed }) =>
                  tw.style(
                    `flex-1 h-11 rounded-lg items-center justify-center bg-slate-100`,
                    pressed ? 'opacity-95' : '',
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Manage subscription"
              >
                <Text style={tw`text-slate-700 text-sm font-medium`}>Manage</Text>
              </Pressable>

              <Pressable
                onPress={onOpenCancelModal}
                style={({ pressed }) =>
                  tw.style(
                    `ml-2 px-4 h-11 rounded-lg items-center justify-center`,
                    pressed ? 'bg-red-50' : '',
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Cancel subscription"
              >
                <Text style={tw`text-red-600 text-sm font-medium`}>Cancel</Text>
              </Pressable>
            </>
          )
        )}
      </View>
    </View>
  );
}

// ---- UI helpers

function calculateUploadUsagePercentage(uploadCount: number, uploadLimit: number): number {
  if (uploadLimit === Number.MAX_SAFE_INTEGER) return 0; // empty bar for unlimited
  const pct = (uploadCount / Math.max(1, uploadLimit)) * 100;
  if (uploadCount <= 0) return 0;
  return clamp(Math.max(5, pct), 0, 100);
}

function getUsageDisplayText(uploadCount: number, uploadLimit: number): string {
  if (uploadLimit === Number.MAX_SAFE_INTEGER) return `${uploadCount} uploads used`;
  return `${uploadCount} / ${uploadLimit} uploads used`;
}

function getProgressBarColor(uploadCount: number, uploadLimit: number): any {
  if (uploadLimit === Number.MAX_SAFE_INTEGER) return tw`bg-green-500`;
  const pct = (uploadCount / Math.max(1, uploadLimit)) * 100;
  if (pct >= 90) return tw`bg-red-500`;
  if (pct >= 70) return tw`bg-orange-500`;
  if (pct >= 50) return tw`bg-yellow-500`;
  return tw`bg-green-500`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function shadow() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 3 },
    default: {},
  });
}
