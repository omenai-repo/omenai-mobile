import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "#config/colors.config";
import { mediumListing } from "#data/uploadArtworkForm.data";
import tw from "twrnc";
import { Pill } from "./Pill";

type PreferencesProps = {
  label: string;
  selectedPreferences: string[];
  setSelectedPreferences: (e: string[]) => void;
};

export default function Preferences({
  label,
  selectedPreferences,
  setSelectedPreferences,
}: Readonly<PreferencesProps>) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleUpdatePreference = (value: string) => {
    if (selectedPreferences.includes(value)) {
      //if artwork pereference is selected then get index and remove from selected
      let arr = [...selectedPreferences];
      let index = arr.indexOf(value);
      arr.splice(index, 1);
      setSelectedPreferences(arr);
    } else if (selectedPreferences.length < 5) {
      const arr = [...selectedPreferences, value];
      setSelectedPreferences(arr);
    } else {
      setError("Maximum of 5 preferences allowed");
    }
  };

  return (
    <View style={tw`gap-5`}>
      <Text style={[tw`text-[14px]`, { color: colors.inputLabel }]}>
        {label}
      </Text>
      <View style={tw`flex-row flex-wrap gap-x-[10px] gap-y-[15px]`}>
        {mediumListing.map((medium, index) => (
          <Pill
            label={medium.label}
            value={medium.value}
            onTap={handleUpdatePreference}
            selected={selectedPreferences.includes(medium.value)}
            key={index}
          />
        ))}
      </View>
      {error && (
        <Text style={tw`text-red-500 text-[12px] font-medium`}>{error}</Text>
      )}
    </View>
  );
}
