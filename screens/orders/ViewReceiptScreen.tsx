import React, { useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { InvoiceTypes } from "#types/types";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { useInvoiceQuery } from "#hooks/useInvoice";
import { useModalStore } from "#store/modal/modalStore";
import { getInvoiceDownloadUrl } from "#lib/storage/getInvoiceFile";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import ReceiptSkeleton from "#components/skeleton/ReceiptSkeleton";

type RouteParams = {
  params: {
    invoice?: InvoiceTypes;
    invoiceNumber?: string;
  };
};

export default function ViewReceiptScreen() {
  const { params } = useRoute<RouteProp<RouteParams, "params">>();
  const { invoice, invoiceNumber } = params;
  const { updateModal } = useModalStore();

  const { data: activeInvoice, isLoading } = useInvoiceQuery(invoiceNumber);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadReceipt = async (fileId: string) => {
    if (!invoiceNumber || !fileId)
      return updateModal({
        message: "Invoice not found",
        showModal: true,
        modalType: "error",
      });

    const downloadUrl = getInvoiceDownloadUrl(fileId);
    if (!downloadUrl)
      return updateModal({
        message: "Invoice not found",
        showModal: true,
        modalType: "error",
      });

    setIsDownloading(true);

    try {
      const filename = `Invoice-${invoiceNumber}.pdf`;
      const file = new File(Paths.cache, filename);

      // Delete existing file if it exists to allow re-download
      if (file.exists) {
        await file.delete();
      }

      // Download the file
      await File.downloadFileAsync(downloadUrl, file);

      if (Platform.OS === "ios" || (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/pdf",
          dialogTitle: `Invoice-${invoiceNumber}`,
        });
      } else {
        updateModal({
          message: `File saved successfully`,
          showModal: true,
          modalType: "success",
        });
      }
    } catch (error) {
      updateModal({
        message: "Download failed",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading && !activeInvoice) {
    return <ReceiptSkeleton />;
  }

  if (!activeInvoice) {
    return (
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-500`}>Invoice not found</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <BackHeaderTitle title="View Receipt" />
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View
          style={tw`bg-white rounded-2xl p-5 shadow-sm border border-gray-100`}
        >
          {/* Header Section */}
          <View style={tw`mb-6 flex-row justify-between items-start`}>
            <View>
              <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
                Receipt
              </Text>
              <Text style={tw`text-gray-500 text-xs`}>
                #{activeInvoice.invoiceNumber}
              </Text>
              <Text style={tw`text-gray-400 text-xs mt-1`}>
                Paid on {formatDate(activeInvoice.paidAt)}
              </Text>
            </View>
            <View style={tw`bg-green-100 px-3 py-1 rounded-lg`}>
              <Text style={tw`text-green-700 text-xs font-bold uppercase`}>
                Paid
              </Text>
            </View>
          </View>

          {/* Billed To (Full Width) */}
          <View style={tw`mb-8`}>
            <Text style={tw`text-gray-400 text-xs uppercase font-bold mb-2`}>
              Billed To
            </Text>
            <Text style={tw`text-gray-900 text-sm font-medium`}>
              {activeInvoice.recipient.name}
            </Text>
            <Text style={tw`text-gray-500 text-xs mt-1 leading-5`}>
              {activeInvoice.recipient.address.address_line},{" "}
              {activeInvoice.recipient.address.city},{" "}
              {activeInvoice.recipient.address.state},{" "}
              {activeInvoice.recipient.address.country}.
            </Text>
          </View>

          {/* Line Items */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-400 text-xs uppercase font-bold mb-3`}>
              Items
            </Text>
            {activeInvoice.lineItems.map((item, index) => (
              <View
                key={index}
                style={tw`flex-row justify-between items-start py-3 border-b border-gray-50 last:border-0`}
              >
                <View style={tw`flex-1 pr-4`}>
                  <Text style={tw`text-sm text-gray-900 mb-1`}>
                    {item.description}
                  </Text>
                  <Text style={tw`text-xs text-gray-400`}>
                    {item.quantity} x {utils_formatPrice(item.unitPrice)}
                  </Text>
                </View>
                <Text style={tw`text-sm font-medium text-gray-900`}>
                  {utils_formatPrice(item.unitPrice * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          {/* Breakdown */}
          <View style={tw`bg-gray-50 rounded-xl p-4 mb-6`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-xs text-gray-500`}>Subtotal</Text>
              <Text style={tw`text-xs font-medium text-gray-900`}>
                {utils_formatPrice(activeInvoice.pricing.unitPrice)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-xs text-gray-500`}>Shipping</Text>
              <Text style={tw`text-xs font-medium text-gray-900`}>
                {utils_formatPrice(activeInvoice.pricing.shipping)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-xs text-gray-500`}>Tax</Text>
              <Text style={tw`text-xs font-medium text-gray-900`}>
                {utils_formatPrice(activeInvoice.pricing.taxes)}
              </Text>
            </View>
            {!!activeInvoice.pricing.discount &&
              activeInvoice.pricing.discount > 0 && (
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`text-xs text-green-600`}>Discount</Text>
                  <Text style={tw`text-xs font-medium text-green-600`}>
                    -{utils_formatPrice(activeInvoice.pricing.discount)}
                  </Text>
                </View>
              )}
            <View style={tw`h-[1px] bg-gray-200 w-full my-2`} />
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-sm font-bold text-gray-900`}>Total</Text>
              <Text style={tw`text-base font-bold text-gray-900`}>
                {utils_formatPrice(activeInvoice.pricing.total)}
              </Text>
            </View>
          </View>

          {/* Footer Metadata */}
          <View style={tw`items-center`}>
            <Text style={tw`text-xs text-gray-300 text-center`}>
              Order ID: {activeInvoice.orderId}
            </Text>
            <Text style={tw`text-xs text-gray-300 text-center mt-1`}>
              Issued by Omenai
            </Text>
          </View>
        </View>

        {/* Download Button */}
        <View style={tw`mt-8 mb-4`}>
          <FittedBlackButton
            value="Download Receipt"
            isLoading={isDownloading}
            onClick={() =>
              handleDownloadReceipt(activeInvoice?.storage?.fileId || "")
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
