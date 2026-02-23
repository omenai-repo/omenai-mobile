import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import {
  PACKAGING_PRESETS,
  PackagingPreset,
  PackagingType,
  checkFit,
  getRecommendedPreset,
} from "#constants/packaging_data";
import PackagingPreview from "./PackagingPreview";
import PackagingWarning from "./PackagingWarning";
import { checkCarrierLimit } from "#utils/shippingLimits";

interface PackagingSelectorProps {
  artDimensions: { length: number; height: number };
  packagingType: PackagingType;
  carrier: string;
  onTypeChange: (type: PackagingType) => void;
  onSelect: (details: {
    length: string;
    width: string;
    height: string;
    weight: string;
  }) => void;
}

export default function PackagingSelector({
  artDimensions,
  packagingType,
  carrier,
  onTypeChange,
  onSelect,
}: Readonly<PackagingSelectorProps>) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const recommendedPreset = useMemo(() => {
    return getRecommendedPreset(
      packagingType,
      artDimensions.length,
      artDimensions.height,
    );
  }, [packagingType, artDimensions.length, artDimensions.height]);

  const handleSelectPreset = (preset: PackagingPreset) => {
    setSelectedPresetId(preset.id);
    setIsCustom(false);
    onSelect({
      length: preset.dims_cm.length.toFixed(1),
      width: preset.dims_cm.width.toFixed(1),
      height: preset.dims_cm.height.toFixed(1),
      weight: preset.weight_kg.toFixed(1),
    });
  };

  const handleCustom = () => {
    setIsCustom(true);
    setSelectedPresetId("");
    onSelect({ length: "", width: "", height: "", weight: "" });
  };

  const presets = PACKAGING_PRESETS[packagingType];

  return (
    <View style={tw`mb-6`}>
      {/* Header with Type Toggle */}
      <View style={tw`bg-gray-50 border border-gray-200 rounded-md p-4 mb-4`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-semibold text-gray-900 capitalize`}>
              {packagingType} Packaging
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>
              Artwork size: {artDimensions.length}" x {artDimensions.height}"
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              onTypeChange(packagingType === "rolled" ? "stretched" : "rolled")
            }
            style={tw`px-3 py-1.5 rounded-md border border-indigo-100`}
          >
            <Text style={tw`text-xs font-medium text-indigo-600`}>
              Switch to {packagingType === "rolled" ? "Stretched" : "Rolled"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Presets Grid - 2x2 Layout */}
      <View style={tw`flex-row flex-wrap gap-3`}>
        {presets.map((preset) => {
          const isCompatible = checkFit(
            preset,
            packagingType,
            artDimensions.length,
            artDimensions.height,
          );
          const isOversize = checkCarrierLimit(
            preset.dims_cm.length,
            preset.dims_cm.width || 1,
            preset.dims_cm.height || 1,
            preset.weight_kg,
            carrier,
          );
          const isSelected = selectedPresetId === preset.id && !isCustom;
          const isRecommended = recommendedPreset?.id === preset.id;
          const isClickable = isCompatible && !isOversize;

          return (
            <TouchableOpacity
              key={preset.id}
              onPress={() => isClickable && handleSelectPreset(preset)}
              disabled={!isClickable}
              style={[
                tw`border rounded-md overflow-hidden`,
                { width: "48%" },
                (!isCompatible || isOversize) && tw`opacity-50`,
                isSelected ? tw`border-gray-900 border-2` : tw`border-gray-200`,
                isOversize && tw`border-amber-200 bg-amber-50`,
              ]}
              activeOpacity={0.7}
            >
              {/* Recommended Badge */}
              {isRecommended && isCompatible && (
                <View
                  style={tw`absolute top-0 left-0 z-10 bg-emerald-500 px-2 py-1 rounded-br-sm`}
                >
                  <Text style={tw`text-white text-[10px] font-bold`}>
                    ✓ BEST FIT
                  </Text>
                </View>
              )}

              {/* Preview */}
              <View style={tw`bg-gray-50 py-3 items-center relative`}>
                <PackagingPreview
                  type={packagingType}
                  width={preset.dims_in.width}
                  height={preset.dims_in.length}
                  depth={preset.dims_in.height}
                />

                {/* Selected Check */}
                {isSelected && (
                  <View
                    style={tw`absolute top-2 right-2 bg-gray-900 rounded-full p-1`}
                  >
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                )}

                {/* Too Small Overlay */}
                {!isCompatible && (
                  <View
                    style={tw`absolute inset-0 bg-white/60 items-center justify-center`}
                  >
                    <View
                      style={tw`bg-white px-2 py-1 rounded-full border border-red-200`}
                    >
                      <Text style={tw`text-red-600 text-[10px] font-bold`}>
                        TOO SMALL
                      </Text>
                    </View>
                  </View>
                )}

                {/* Exceeds Courier Warning */}
                {isCompatible && isOversize && !isSelected && (
                  <View
                    style={tw`absolute inset-0 bg-white/70 items-center justify-center`}
                  >
                    <View
                      style={tw`bg-white px-2 py-1.5 rounded border border-amber-200 items-center`}
                    >
                      <Ionicons
                        name="warning"
                        size={14}
                        color="#D97706"
                        style={tw`mb-1`}
                      />
                      <Text
                        style={tw`text-amber-800 text-[10px] font-bold text-center`}
                      >
                        COURIER SIZE
                        {"\n"}LIMITS
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={tw`p-2.5 border-t border-gray-100 bg-white flex-1`}>
                <View style={tw`flex-row justify-between items-start`}>
                  <Text style={tw`font-semibold text-xs text-gray-800 flex-1`}>
                    {preset.label}
                  </Text>
                  <View
                    style={tw`bg-gray-100 px-1.5 py-0.5 rounded-md flex-row items-baseline`}
                  >
                    <Text style={tw`text-[8px] text-gray-400 mr-1`}>Max</Text>
                    <Text style={tw`text-[10px] font-bold text-gray-600`}>
                      {preset.weight_lbs} lbs
                    </Text>
                  </View>
                </View>
                <Text style={tw`text-[10px] text-gray-500 mt-1`}>
                  {preset.description}
                </Text>
                <Text style={tw`text-[10px] text-gray-400 mt-1`}>
                  {preset.dims_in.length}" × {preset.dims_in.width}" ×{" "}
                  {preset.dims_in.height}"
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Option */}
      <TouchableOpacity
        onPress={handleCustom}
        style={[
          tw`mt-3 border-2 border-dashed rounded-md flex-row items-center p-4`,
          isCustom ? tw`border-gray-900 bg-gray-50` : tw`border-gray-300`,
        ]}
        activeOpacity={0.7}
      >
        <View
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3`}
        >
          <Ionicons name="create-outline" size={20} color="#6B7280" />
        </View>
        <View>
          <Text style={tw`text-sm font-semibold text-gray-800`}>
            Custom Dimensions
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            For oversized or special items
          </Text>
        </View>
      </TouchableOpacity>

      {/* Warning Note */}
      <PackagingWarning type={packagingType} />
    </View>
  );
}
