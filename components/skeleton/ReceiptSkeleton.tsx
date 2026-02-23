import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";

/**
 * Skeleton loader for the ViewReceiptScreen.
 * Mimics the receipt card layout.
 */
export default function ReceiptSkeleton() {
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <BackHeaderTitle title="View Receipt" />

      <View style={tw`p-4`}>
        <View
          style={tw`bg-white rounded-md p-5 shadow-sm border border-gray-100`}
        >
          {/* Header Section */}
          <View style={tw`mb-6 flex-row justify-between items-start`}>
            <View>
              <Skeleton colorMode="light" height={28} width={100} radius={4} />
              <View style={tw`mt-2`}>
                <Skeleton
                  colorMode="light"
                  height={12}
                  width={140}
                  radius={4}
                />
              </View>
              <View style={tw`mt-1`}>
                <Skeleton
                  colorMode="light"
                  height={12}
                  width={100}
                  radius={4}
                />
              </View>
            </View>
            <Skeleton colorMode="light" height={24} width={50} radius={8} />
          </View>

          {/* Billed To */}
          <View style={tw`mb-8`}>
            <Skeleton colorMode="light" height={12} width={80} radius={4} />
            <View style={tw`mt-2`}>
              <Skeleton colorMode="light" height={16} width={150} radius={4} />
            </View>
            <View style={tw`mt-1`}>
              <Skeleton colorMode="light" height={12} width="90%" radius={4} />
            </View>
          </View>

          {/* Line Items */}
          <View style={tw`mb-6`}>
            <Skeleton colorMode="light" height={12} width={50} radius={4} />
            <View style={tw`mt-3`}>
              <View style={tw`flex-row justify-between py-3`}>
                <View style={tw`flex-1`}>
                  <Skeleton
                    colorMode="light"
                    height={14}
                    width="60%"
                    radius={4}
                  />
                  <View style={tw`mt-1`}>
                    <Skeleton
                      colorMode="light"
                      height={12}
                      width={80}
                      radius={4}
                    />
                  </View>
                </View>
                <Skeleton colorMode="light" height={14} width={60} radius={4} />
              </View>
              <View style={tw`flex-row justify-between py-3`}>
                <View style={tw`flex-1`}>
                  <Skeleton
                    colorMode="light"
                    height={14}
                    width="50%"
                    radius={4}
                  />
                  <View style={tw`mt-1`}>
                    <Skeleton
                      colorMode="light"
                      height={12}
                      width={60}
                      radius={4}
                    />
                  </View>
                </View>
                <Skeleton colorMode="light" height={14} width={40} radius={4} />
              </View>
            </View>
          </View>

          {/* Breakdown */}
          <View style={tw`bg-gray-50 rounded-md p-4 mb-6`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Skeleton colorMode="light" height={12} width={60} radius={4} />
              <Skeleton colorMode="light" height={12} width={70} radius={4} />
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Skeleton colorMode="light" height={12} width={60} radius={4} />
              <Skeleton colorMode="light" height={12} width={50} radius={4} />
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Skeleton colorMode="light" height={12} width={30} radius={4} />
              <Skeleton colorMode="light" height={12} width={40} radius={4} />
            </View>
            <View style={tw`h-[1px] bg-gray-200 w-full my-2`} />
            <View style={tw`flex-row justify-between`}>
              <Skeleton colorMode="light" height={16} width={50} radius={4} />
              <Skeleton colorMode="light" height={18} width={80} radius={4} />
            </View>
          </View>

          {/* Footer */}
          <View style={tw`items-center`}>
            <Skeleton colorMode="light" height={12} width={120} radius={4} />
            <View style={tw`mt-1`}>
              <Skeleton colorMode="light" height={12} width={100} radius={4} />
            </View>
          </View>
        </View>

        {/* Download Button */}
        <View style={tw`mt-8 mb-4`}>
          <Skeleton colorMode="light" height={44} width="100%" radius={8} />
        </View>
      </View>
    </View>
  );
}
