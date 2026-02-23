import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import { licenseIcon } from "#utils/SvgImages";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import ScrollWrapper from "#components/general/ScrollWrapper";
import SaveArtworkButton from "./SaveArtworkButton";
import ShippingAndTaxes from "./extraDetails/ShippingAndTaxes";
import Coverage from "./extraDetails/Coverage";
import ArtworkStatusBadge from "../../../components/artwork/ArtworkStatusBadge";
import { ArtworkDataType } from "#types/types";

export default function ArtworkContentSection({
  artwork,
  userType,
  isTabletLandscape,
  isTabletSize,
  primaryButton,
}: {
  artwork: ArtworkDataType;
  userType: string;
  isTabletLandscape: boolean;
  isTabletSize: boolean;
  primaryButton: React.ReactNode;
}) {
  return (
    <View style={isTabletLandscape ? [tw`pl-5`, { flex: 0.5 }] : tw``}>
      <View style={tw`my-[25px]`}>
        <Text
          style={tw`text-slate-900 text-2xl text-balance hyphens-auto tracking-tight font-serif`}
        >
          {artwork.title}
        </Text>
        <Text style={tw`font-sans text-lg text-slate-600 mt-3 font-medium`}>
          {artwork.artist}
        </Text>
        <View
          style={tw`flex-row w-full flex-wrap items-center gap-4 border-t border-b border-slate-100 py-4 mt-6`}
        >
          <Text
            style={tw`font-sans text-[10px] uppercase tracking-widest text-slate-500`}
          >
            {artwork.medium}
          </Text>
          <View style={tw`h-3 w-[1px] bg-slate-200`} />
          <Text
            style={tw`font-sans text-[10px] uppercase tracking-widest text-slate-500`}
          >
            {artwork.year}
          </Text>
          <View style={tw`h-3 w-[1px] bg-slate-200`} />
          <Text
            style={tw`font-sans text-[10px] uppercase tracking-widest text-slate-500`}
          >
            {artwork.rarity}
          </Text>
        </View>

        {artwork.dimensions && (
          <View
            style={tw`bg-[#F9F9F9] px-3 py-4 mt-6 border-[0.5px] border-neutral-100`}
          >
            <Text
              style={tw`text-[9px] uppercase tracking-widest text-slate-400 mb-4`}
            >
              Physical Specifications
            </Text>
            <View style={tw`flex-row items-center gap-4 flex-wrap`}>
              {artwork.dimensions.height &&
                artwork.dimensions.height !== "0" && (
                  <View
                    style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
                  >
                    <Text style={tw`text-xs text-slate-500 font-light`}>
                      Height
                    </Text>
                    <Text style={tw`text-xs text-dark`}>
                      {artwork.dimensions.height}
                      {artwork.dimensions.height.includes("cm") ||
                      artwork.dimensions.height.includes("in")
                        ? ""
                        : "cm"}
                    </Text>
                  </View>
                )}
              {((artwork.dimensions.width &&
                artwork.dimensions.width !== "0") ||
                (artwork.dimensions.length &&
                  artwork.dimensions.length !== "0")) && (
                <View
                  style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
                >
                  <Text style={tw`text-xs text-slate-500 font-light`}>
                    Width
                  </Text>
                  <Text style={tw`text-xs text-dark`}>
                    {artwork.dimensions.width &&
                    artwork.dimensions.width !== "0"
                      ? artwork.dimensions.width
                      : artwork.dimensions.length}
                    {(artwork.dimensions.width &&
                    artwork.dimensions.width !== "0"
                      ? artwork.dimensions.width
                      : artwork.dimensions.length
                    ).includes("cm") ||
                    (artwork.dimensions.width &&
                    artwork.dimensions.width !== "0"
                      ? artwork.dimensions.width
                      : artwork.dimensions.length
                    ).includes("in")
                      ? ""
                      : "cm"}
                  </Text>
                </View>
              )}
              {artwork.dimensions.weight &&
                artwork.dimensions.weight !== "0" && (
                  <View
                    style={tw`flex-row items-center justify-between flex-1 min-w-[28%] border-b border-slate-200 pb-2`}
                  >
                    <Text style={tw`text-xs text-slate-500 font-light`}>
                      Weight
                    </Text>
                    <Text style={tw`text-xs text-dark`}>
                      {artwork.dimensions.weight}
                      {artwork.dimensions.weight.includes("kg") ||
                      artwork.dimensions.weight.includes("lb")
                        ? ""
                        : "kg"}
                    </Text>
                  </View>
                )}
            </View>
          </View>
        )}

        <Text style={tw`text-[10px] uppercase text-slate-400 mt-6 mb-2`}>
          Price
        </Text>
        {artwork.availability ? (
          <Text style={tw`text-3xl text-dark font-extralight tracking-wide`}>
            {artwork.pricing.shouldShowPrice === "Yes" ||
            ["gallery", "artist"].includes(userType)
              ? utils_formatPrice(Number(artwork.pricing.usd_price))
              : "Price on request"}
          </Text>
        ) : (
          <ArtworkStatusBadge status="Sold" />
        )}

        <ScrollWrapper horizontal showsHorizontalScrollIndicator={false}>
          <View style={tw`mt-4 flex-row items-center gap-[10px]`}>
            {artwork.certificate_of_authenticity === "Yes" && (
              <View
                style={tw`flex-row items-center justify-center gap-2.5 px-2.5 py-2 rounded-md bg-[#F2F8F4]`}
              >
                <SvgXml xml={licenseIcon} />
                <Text style={tw`text-[#004617] text-[13px] font-medium`}>
                  Certificate of authenticity available
                </Text>
              </View>
            )}
          </View>
        </ScrollWrapper>
      </View>

      <View style={tw`gap-[15px] mt-[10px] w-full`}>
        <View style={tw`w-full`}>{primaryButton}</View>

        <View style={tw`w-full`}>
          {!["gallery", "artist"].includes(userType) && (
            <SaveArtworkButton
              likeIds={artwork.like_IDs || []}
              art_id={artwork.art_id || ""}
              impressions={artwork.impressions || 0}
            />
          )}
        </View>
      </View>

      <View style={[tw`mt-[30px] gap-[15px]`, isTabletSize && tw`flex-row`]}>
        <View style={isTabletSize ? { flex: 1 } : undefined}>
          <ShippingAndTaxes />
        </View>
        <View style={isTabletSize ? { flex: 1 } : undefined}>
          <Coverage />
        </View>
      </View>
    </View>
  );
}
