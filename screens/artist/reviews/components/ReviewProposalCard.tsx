import React, { useMemo, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

import { utils_formatPrice } from "#utils/utils_priceFormatter";
import ReviewStatusBadge from "./ReviewStatusBadge";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { colors } from "#config/colors.config";
import FittedBlackButton from "#components/buttons/FittedBlackButton";

type ReviewAction = "ACCEPT" | "DECLINE";

type ReviewProposalCardProps = {
  review: any;
  isMutating?: boolean;
  mutatingAction?: ReviewAction;
  onResolve: (action: ReviewAction) => void;
};

function labelFromJustificationType(value?: string) {
  if (!value) return "N/A";
  return value.replaceAll("_", " ").toLowerCase();
}

function getCurationMessage(review: any) {
  const status = review?.status;

  if (status === "PENDING_ARTIST_ACTION") {
    const note =
      review?.review?.admin_notes ||
      "We propose this market value to ensure a rapid sell-through rate based on market traction.";

    return {
      title: "Reviewer Notes",
      body: `\"${note}\"`,
      container: tw`bg-[#FFF4E5] border border-[#FFD9A3]`,
      text: tw`text-[#7A4A00]`,
    };
  }

  if (status === "PENDING_ADMIN_REVIEW") {
    return {
      title: "Status",
      body: "Your proof of value is currently under review by our curation team. Expected turnaround is less than 24 hours.",
      container: tw`bg-[#F8FAFC] border border-[#E2E8F0]`,
      text: tw`text-[#475569]`,
    };
  }

  if (status === "DECLINED_BY_ADMIN") {
    return {
      title: "Decline Reason",
      body: review?.review?.decline_reason || "This request was not approved.",
      container: tw`bg-[#FEF2F2] border border-[#FECACA]`,
      text: tw`text-[#991B1B]`,
    };
  }

  return {
    title: "Status",
    body: "No additional action is required for this request.",
    container: tw`bg-[#F8FAFC] border border-[#E2E8F0]`,
    text: tw`text-[#475569]`,
  };
}

export default function ReviewProposalCard({
  review,
  isMutating,
  mutatingAction,
  onResolve,
}: ReviewProposalCardProps) {
  const isActionRequired = review?.status === "PENDING_ARTIST_ACTION";
  const [isExpanded, setIsExpanded] = useState(isActionRequired);

  const artwork = review?.meta?.artwork || {};
  const requestedPrice = Number(review?.artist_review?.requested_price || 0);
  const counterOfferPrice = Number(review?.review?.counter_offer_price || 0);
  const dimensions = artwork?.dimensions || {};

  const curationMessage = useMemo(() => getCurationMessage(review), [review]);
  const isDeclineMutating = !!isMutating && mutatingAction === "DECLINE";
  const isAcceptMutating = !!isMutating && mutatingAction === "ACCEPT";

  const onOpenProof = async () => {
    const url = review?.artist_review?.justification_proof_url;
    if (!url) return;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const formattedImageUrl = useMemo(() => {
    if (!artwork?.url) return null;
    if (artwork.url.startsWith("http")) return artwork.url;
    return getImageFileView(artwork.url, 200).toString();
  }, [artwork?.url]);

  return (
    <View
      style={tw`bg-white border border-neutral-200 rounded-sm overflow-hidden mb-4`}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsExpanded((prev) => !prev)}
        style={tw`p-4`}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-[70px] h-[70px] rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200`}
          >
            {formattedImageUrl ? (
              <Image
                source={{ uri: formattedImageUrl }}
                style={tw`w-full h-full`}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={tw`flex-1 items-center justify-center`}>
                <Feather name="image" size={20} color="#9ca3af" />
              </View>
            )}
          </View>

          <View style={tw`flex-1 ml-4 justify-center`}>
            <View style={tw`flex-row justify-between items-start`}>
              <Text
                numberOfLines={2}
                style={tw`flex-1 text-[17px] capitalize font-sans-medium text-[${colors.black}] pr-2 leading-[22px] tracking-tight`}
              >
                {artwork?.title || "Untitled Artwork"}
              </Text>
              <View style={tw`pt-0.5`}>
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </View>

            <Text
              numberOfLines={1}
              style={tw`text-sm text-slate-500 font-sans-regular mt-1`}
            >
              {artwork?.medium || "Artwork"}
              {dimensions?.height && dimensions?.width
                ? ` • ${dimensions.height} x ${dimensions.width}`
                : ""}
            </Text>
          </View>
        </View>

        <View style={tw`h-[1px] bg-neutral-100 mt-4 mb-3`} />

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <View>
              <Text
                style={tw`text-xs tracking-[1px] font-sans-semibold text-slate-400 mb-0.5 uppercase`}
              >
                REQUESTED
              </Text>
              <Text
                style={[
                  tw`text-lg font-sans-bold text-slate-900 leading-tight`,
                  isActionRequired ? tw`text-slate-400 line-through` : null,
                ]}
              >
                {utils_formatPrice(requestedPrice, "USD", 0)}
              </Text>
            </View>

            {isActionRequired && counterOfferPrice > 0 && (
              <>
                <Feather
                  name="arrow-right"
                  size={16}
                  color="#CBD5E1"
                  style={tw`mx-3 mt-2`}
                />
                <View>
                  <Text
                    style={tw`text-xs tracking-[1px] font-sans-semibold text-amber-600 mb-0.5 uppercase`}
                  >
                    PROPOSED VALUE
                  </Text>
                  <Text
                    style={tw`text-lg font-sans-bold text-slate-900 leading-tight`}
                  >
                    {utils_formatPrice(counterOfferPrice, "USD", 0)}
                  </Text>
                </View>
              </>
            )}
          </View>

          <ReviewStatusBadge status={review?.status} />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={tw`border-t border-neutral-200 bg-neutral-50 p-4`}>
          <View style={tw`bg-white border border-neutral-200 rounded-sm p-4`}>
            <View>
              <View style={tw`mb-4`}>
                <Text
                  style={tw`text-xs tracking-[1px] font-sans-semibold text-slate-400 mb-1.5`}
                >
                  JUSTIFICATION TYPE
                </Text>
                <Text
                  style={tw`text-base font-sans-medium text-slate-900 capitalize`}
                >
                  {labelFromJustificationType(
                    review?.artist_review?.justification_type
                  )}
                </Text>
              </View>

              {review?.artist_review?.justification_proof_url && (
                <TouchableOpacity onPress={onOpenProof} style={tw`mb-4`}>
                  <Text
                    style={tw`text-xs tracking-[1px] font-sans-semibold text-slate-400 mb-1.5`}
                  >
                    SUBMITTED PROOF
                  </Text>
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-base text-[#1E5FD6] font-sans-medium`}>
                      View attachment/link
                    </Text>
                    <Feather
                      name="external-link"
                      size={14}
                      color="#1E5FD6"
                      style={tw`ml-1.5`}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {review?.artist_review?.justification_notes && (
              <View style={tw`border-t border-neutral-200 pt-3`}>
                <Text
                  style={tw`text-xs tracking-[1px] font-sans-semibold text-slate-400 mb-1.5`}
                >
                  YOUR NOTES
                </Text>
                <Text style={tw`text-base leading-5 text-slate-900 italic`}>
                  &quot;{review.artist_review.justification_notes}&quot;
                </Text>
              </View>
            )}
          </View>

          <View style={[tw`mt-3 rounded-sm p-4`, curationMessage.container]}>
            <Text
              style={[
                tw`text-xs tracking-[1px] font-sans-semibold mb-1`,
                curationMessage.text,
              ]}
            >
              {curationMessage.title.toUpperCase()}
            </Text>
            <Text
              style={[
                tw`text-base leading-5 font-sans-regular mt-1`,
                curationMessage.text,
              ]}
            >
              {curationMessage.body}
            </Text>
          </View>

          {isActionRequired && (
            <View style={tw`mt-5 flex-row gap-3`}>
              <View style={tw`flex-1`}>
                <FittedBlackButton
                  isLoading={isDeclineMutating}
                  isDisabled={!!isMutating}
                  onClick={() => onResolve("DECLINE")}
                  value="Decline"
                  style={tw`border border-[#D1D5DB] bg-white w-full`}
                  textStyle={tw`text-slate-900`}
                />
              </View>

              <View style={tw`flex-1`}>
                <FittedBlackButton
                  isLoading={isAcceptMutating}
                  isDisabled={!!isMutating}
                  onClick={() => onResolve("ACCEPT")}
                  value="Accept Offer"
                  style={tw`w-full`}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
