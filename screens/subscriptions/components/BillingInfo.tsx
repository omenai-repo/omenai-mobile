import React from 'react';
import { View, Text, Platform } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from 'store/app/appStore';

export default function BillingInfo() {
  const { userSession } = useAppStore();

  const name = userSession?.name;
  const email = userSession?.email;

  return (
    <View style={[tw`w-full`, {}]}>
      <View
        style={[tw`bg-white rounded-2xl border border-slate-200 overflow-hidden`, cardShadow()]}
      >
        {/* Header */}
        <View style={tw`bg-slate-50 px-5 py-4 border-b border-slate-200`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw.style(`p-2 bg-white rounded-lg mr-3`, cardShadowSm())}>
              <Ionicons name="person-circle-outline" size={20} color="#475569" />
            </View>
            <Text style={tw`text-slate-900 font-semibold`}>Billing Information</Text>
          </View>
        </View>

        {/* Content */}
        <View style={tw`p-5`}>
          {/* Gallery Name */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-[10px] font-medium text-slate-500 uppercase tracking-widest`}>
              Gallery Name
            </Text>
            <Text style={tw`text-slate-900 font-medium mt-1`}>{name}</Text>
          </View>

          {/* Email Address */}
          <View>
            <Text style={tw`text-[10px] font-medium text-slate-500 uppercase tracking-widest`}>
              Email Address
            </Text>

            <View style={tw`flex-row items-center mt-1`}>
              <Text style={tw`text-slate-900 font-medium`} numberOfLines={1}>
                {email}
              </Text>

              <View style={tw`ml-2 px-2 py-0.5 rounded-full bg-green-100`}>
                <Text style={tw`text-green-700 text-[10px] font-medium`}>Verified</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function cardShadow() {
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

function cardShadowSm() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    android: { elevation: 2 },
    default: {},
  });
}
