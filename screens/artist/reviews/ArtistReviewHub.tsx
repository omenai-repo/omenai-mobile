import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tw from "twrnc";

import ScrollWrapper from "#components/general/ScrollWrapper";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";
import { fetchPriceReviewRequests } from "#services/artworks/fetchPriceReviewRequests";
import { updatePriceReviewRequest } from "#services/artworks/updatePriceReviewRequest";
import ReviewProposalCard from "./components/ReviewProposalCard";
import EmptyReviewState from "./components/EmptyReviewState";
import { type ReviewHubTab } from "./components/ReviewHubTabs";
import ReviewHubHeader from "./components/ReviewHubHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATUS_MAP: Record<ReviewHubTab, string> = {
  ACTIVE: "PENDING_ADMIN_REVIEW,PENDING_ARTIST_ACTION",
  RESOLVED:
    "APPROVED_ARTIST_PRICE,APPROVED_COUNTER_PRICE,AUTO_APPROVED,DECLINED_BY_ADMIN,DECLINED_BY_ARTIST",
};

export default function ArtistReviewHub() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { updateModal } = useModalStore();
  const { userSession } = useAppStore();

  const artistId = userSession?.artist_id || userSession?.id;

  const [activeTab, setActiveTab] = useState<ReviewHubTab>("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const getImageFormatFromReview = (review: any) => {
    const imageFormat =
      review?.meta?.artwork?.image_format || review?.image_format;
    return imageFormat && typeof imageFormat === "object" ? imageFormat : {};
  };

  const queryKey = useMemo(
    () => ["artist_price_reviews", artistId, activeTab, currentPage],
    [artistId, activeTab, currentPage]
  );

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      return fetchPriceReviewRequests({
        artistId,
        page: currentPage,
        limit: 10,
        status: STATUS_MAP[activeTab],
      });
    },
    enabled: !!artistId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!listQuery.data) return;

    if (!listQuery.data.isOk) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: listQuery.data.message || "Unable to fetch pricing proposals",
      });
      return;
    }

    const fetchedPage = listQuery.data?.meta?.currentPage;
    if (typeof fetchedPage === "number" && fetchedPage !== currentPage) {
      return;
    }

    setMeta(
      listQuery.data.meta || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    );

    setReviews((prev) => {
      if (currentPage === 1) return listQuery.data?.data || [];
      return [...prev, ...(listQuery.data?.data || [])];
    });
  }, [currentPage, listQuery.data, listQuery.dataUpdatedAt, updateModal]);

  const resolveOfferMutation = useMutation({
    mutationFn: async ({
      reviewId,
      action,
      imageFormat,
    }: {
      reviewId: string;
      action: "ACCEPT" | "DECLINE";
      imageFormat: Record<string, any>;
    }) => {
      const res = await updatePriceReviewRequest({
        artist_id: artistId,
        review_id: reviewId,
        action,
        image_format: imageFormat,
      });

      if (!res.isOk) {
        throw new Error(res.message || "Unable to resolve proposal");
      }

      return res;
    },
    onSuccess: async (res) => {
      updateModal({
        showModal: true,
        modalType: "success",
        message: res.message || "Proposal updated",
      });

      setCurrentPage(1);

      await queryClient.invalidateQueries({
        queryKey: ["artist_price_reviews", artistId],
        exact: false,
      });

      await queryClient.refetchQueries({
        queryKey: ["artist_price_reviews", artistId],
        type: "active",
      });
    },
    onError: (error: any) => {
      updateModal({
        showModal: true,
        modalType: "error",
        message: error?.message || "Unable to resolve proposal",
      });
    },
  });

  const onRefresh = async () => {
    setCurrentPage(1);

    // If already on page 1, force a refetch so dataUpdatedAt changes
    // and the list state can be rebuilt even with structural sharing.
    if (currentPage === 1) {
      await listQuery.refetch();
    }
  };

  const isInitialLoading =
    (listQuery.isLoading || (listQuery.isFetching && currentPage === 1)) &&
    reviews.length === 0;
  const canLoadMore = currentPage < (meta?.totalPages || 1);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ReviewHubHeader
        activeTab={activeTab}
        onTabChange={(tab: ReviewHubTab) => {
          setActiveTab(tab);
          setCurrentPage(1);
          setReviews([]);
        }}
        topInset={insets.top}
      />

      <ScrollWrapper
        style={tw`flex-1`}
        contentContainerStyle={tw`px-4 pb-8`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={listQuery.isFetching && currentPage === 1}
            onRefresh={onRefresh}
          />
        }
      >
        {isInitialLoading ? (
          <View style={tw`py-12 items-center`}>
            <ActivityIndicator size="small" color="#111827" />
            <Text style={tw`mt-3 text-base text-slate-500`}>
              Loading your pricing hub...
            </Text>
          </View>
        ) : reviews.length === 0 ? (
          <EmptyReviewState tab={activeTab} />
        ) : (
          <View>
            {reviews.map((review) => (
              <ReviewProposalCard
                key={review?._id}
                review={review}
                isMutating={
                  resolveOfferMutation.isPending &&
                  (resolveOfferMutation.variables as any)?.reviewId ===
                    review?._id
                }
                mutatingAction={
                  resolveOfferMutation.isPending &&
                  (resolveOfferMutation.variables as any)?.reviewId ===
                    review?._id
                    ? (resolveOfferMutation.variables as any)?.action
                    : undefined
                }
                onResolve={(action) =>
                  resolveOfferMutation.mutate({
                    reviewId: review?._id,
                    action,
                    imageFormat: getImageFormatFromReview(review),
                  })
                }
              />
            ))}

            {canLoadMore ? (
              <TouchableOpacity
                disabled={listQuery.isFetching}
                onPress={() => setCurrentPage((p) => p + 1)}
                style={tw`h-11 mt-2 rounded-xl border border-[#D1D5DB] bg-white items-center justify-center`}
              >
                {listQuery.isFetching ? (
                  <ActivityIndicator size="small" color="#111827" />
                ) : (
                  <Text style={tw`text-[#111827] font-semibold`}>
                    Load more
                  </Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollWrapper>
    </View>
  );
}
