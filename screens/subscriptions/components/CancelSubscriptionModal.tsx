import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from 'store/app/appStore';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { cancelSubscription } from 'services/subscriptions/cancelSubscription';

type Props = {
  visible: boolean;
  subEnd: string | Date;
  onClose: () => void;
};

export default function CancelSubscriptionModal({ visible, subEnd, onClose }: Props) {
  const { userSession } = useAppStore();
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // animations
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  // breadcrumb when modal open
  useEffect(() => {
    if (visible) {
      Sentry.addBreadcrumb({
        category: 'ui.modal',
        message: 'CancelSubscriptionModal opened',
        level: 'info',
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setErr(null);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.96);
    }
  }, [visible, fade, scale]);

  const formattedEnd = formatIntlDateTime?.(subEnd) ?? new Date(subEnd).toLocaleString();

  const handleCancel = async () => {
    if (loading) return;
    setLoading(true);
    setErr(null);

    Sentry.addBreadcrumb({
      category: 'user.action',
      message: 'User confirmed subscription cancellation',
      level: 'info',
    });

    try {
      Sentry.setContext('cancelSubscriptionRequest', {
        userId: userSession?.id,
        email: userSession?.email,
        subEnd: String(subEnd),
      });

      const res = await cancelSubscription(userSession.id);

      if (!res?.isOk) {
        Sentry.setContext('cancelSubscriptionResponse', { response: res, userId: userSession?.id });
        Sentry.captureMessage(
          `cancelSubscription returned non-ok for user ${userSession?.id}`,
          'error',
        );

        setErr(res?.message || 'Failed to cancel subscription.');

        Sentry.addBreadcrumb({
          category: 'network',
          message: `cancelSubscription non-ok: ${res?.message ?? 'no message'}`,
          level: 'error',
        });
      } else {
        Sentry.addBreadcrumb({
          category: 'network',
          message: 'cancelSubscription succeeded',
          level: 'info',
        });

        qc.invalidateQueries({ queryKey: ['subscription_precheck'] });
        onClose();
      }
    } catch (e: any) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'cancelSubscription threw exception',
        level: 'error',
      });
      Sentry.setContext('cancelSubscriptionCatch', {
        userId: userSession?.id,
        subEnd: String(subEnd),
      });
      Sentry.captureException(e);

      setErr(e?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {
        if (!loading) onClose();
      }}
    >
      <Animated.View
        style={[tw`flex-1 bg-black/60 items-center justify-center px-4`, { opacity: fade }]}
      >
        <Pressable onPress={() => !loading && onClose()} style={tw`absolute inset-0`} />
        <Animated.View
          style={[
            tw`w-11/12 max-w:420px bg-white rounded-2xl overflow-hidden`,
            { transform: [{ scale }] },
            cardShadow(),
          ]}
        >
          {/* Header */}
          <View style={tw`bg-red-50 px-5 py-4 border-b border-red-100`}>
            <View style={tw`flex-row items-start`}>
              <View style={tw`p-2 bg-red-100 rounded-full mr-3`}>
                <Ionicons name="warning" size={20} color="#dc2626" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-base font-semibold text-slate-900`}>Cancel Subscription</Text>
                <Text style={tw`text-xs text-slate-600 mt-1`}>This action cannot be undone</Text>
              </View>
              <Pressable
                onPress={() => !loading && onClose()}
                style={tw`p-1 rounded-lg`}
                android_ripple={{ color: '#fecaca' }}
              >
                <Ionicons name="close" size={18} color="#94a3b8" />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View style={tw`p-5`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-slate-700`}>
                Your subscription will remain active until:
              </Text>
              <View style={tw`bg-slate-100 rounded-lg px-4 py-3 mt-2`}>
                <Text style={tw`font-semibold text-slate-900`}>{formattedEnd}</Text>
              </View>
            </View>

            {/* Warning box */}
            <View style={tw`bg-amber-50 border border-amber-200 rounded-lg p-4`}>
              <View style={tw`flex-row`}>
                <Ionicons name="alert-circle" size={18} color="#b45309" style={tw`mr-2 mt-0.5`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm font-medium text-amber-900`}>
                    What happens after cancellation:
                  </Text>
                  <View style={tw`mt-2`}>
                    <Bullet>Unable to upload new artworks or events</Bullet>
                    <Bullet>Existing artworks will be suspended</Bullet>
                    <Bullet>Loss of access to premium features</Bullet>
                  </View>
                </View>
              </View>
            </View>

            {!!err && (
              <View style={tw`mt-4 bg-red-50 border border-red-200 rounded-lg p-3`}>
                <Text style={tw`text-red-700 text-xs`}>{err}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={tw`bg-slate-50 px-5 py-4 border-t border-slate-200`}>
            <View style={tw`flex-row justify-center`}>
              <Pressable
                onPress={() => !loading && onClose()}
                style={({ pressed }) =>
                  tw.style(
                    `px-4 h-11 rounded-lg items-center justify-center bg-white border border-slate-300 mr-2`,
                    pressed ? 'opacity-95' : '',
                  )
                }
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Keep Subscription"
              >
                <Text style={tw`text-slate-700 text-sm font-medium`}>Keep Subscription</Text>
              </Pressable>

              <Pressable
                onPress={handleCancel}
                style={({ pressed }) =>
                  tw.style(
                    `px-4 h-11 rounded-lg items-center justify-center bg-red-600`,
                    pressed ? 'opacity-90' : '',
                  )
                }
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Yes, Cancel"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tw`text-white text-sm font-medium`}>Yes, Cancel</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={tw`flex-row items-start mt-1.5`}>
      <Text style={tw`text-amber-600 mr-2 mt-0.5`}>•</Text>
      <Text style={tw`text-sm text-amber-800 flex-1`}>{children}</Text>
    </View>
  );
}

function cardShadow() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 4 },
    default: {},
  });
}
