import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import tw from "twrnc";
import Input from "#components/inputs/Input";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { FontAwesome6 } from "@expo/vector-icons";

type SocialsProps = {
  socials: {
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    behance: string;
    tiktok: string;
  };
  setSocials: (key: string, value: string) => void;
};

interface SocialLink {
  type: string;
  url: string;
}

const socialOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook" },
  { value: "behance", label: "Behance" },
  { value: "tiktok", label: "TikTok" },
];

const HTTPS_PREFIX = "https://";
const HTTP_PREFIX = "http://";

const Socials = ({ socials, setSocials }: SocialsProps) => {
  const { width } = useWindowDimensions();

  // Convert the object state from parent into an array for local management
  const [links, setLinks] = useState<SocialLink[]>(() => {
    const initialLinks = Object.entries(socials)
      .filter(([_, url]) => !!url)
      .map(([type, url]) => ({ type, url }));
    return initialLinks.length === 0 ? [{ type: "", url: "" }] : initialLinks;
  });

  const selectedTypes = new Set(links.map((link) => link.type).filter(Boolean));

  const handleLinkChange = useCallback(
    (index: number, field: keyof SocialLink, value: string) => {
      setLinks((prev) =>
        prev.map((link, i) => {
          if (i === index) {
            let newValue = value;

            if (field === "url") {
              // Strip prefixes if user pasted full URL or to normalize input
              if (newValue.toLowerCase().startsWith(HTTPS_PREFIX)) {
                newValue = newValue.substring(HTTPS_PREFIX.length);
              } else if (newValue.toLowerCase().startsWith(HTTP_PREFIX)) {
                newValue = newValue.substring(HTTP_PREFIX.length);
              }

              // Prepend HTTPS_PREFIX for storage, just like on web
              const urlForState = newValue.trim()
                ? HTTPS_PREFIX + newValue.trim()
                : "";

              return { ...link, [field]: urlForState };
            }

            return { ...link, [field]: newValue };
          }
          return link;
        }),
      );
    },
    [],
  );

  // Synchronize local array back to parent object state
  useEffect(() => {
    // Reset all parent socials first (clear previous values not in current list)
    socialOptions.forEach((opt) => setSocials(opt.value, ""));

    // Set currently active links
    links.forEach((link) => {
      if (link.type && link.url.trim()) {
        // link.url already includes HTTPS_PREFIX from handleLinkChange
        setSocials(link.type, link.url.trim());
      }
    });
  }, [links]);

  const addLink = () => {
    if (links.length < socialOptions.length) {
      setLinks([...links, { type: "", url: "" }]);
    }
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    } else {
      setLinks([{ type: "", url: "" }]);
    }
  };

  return (
    <View
      style={tw.style(`gap-[20px] mb-[30px]`, {
        marginHorizontal: width / 15,
      })}
    >
      {links.map((link, index) => {
        const displayUrl = link.url
          ? link.url.replace(HTTPS_PREFIX, "").replace(HTTP_PREFIX, "")
          : "";

        return (
          <View key={link.type || index} style={tw`flex-row items-center gap-2`}>
            {/* Platform Selector */}
            <View style={tw`w-[120px]`}>
              <CustomSelectPicker
                label=""
                placeholder="Select"
                value={link.type}
                data={socialOptions.map((opt) => ({
                  ...opt,
                  disabled:
                    selectedTypes.has(opt.value) &&
                    opt.value !== link.type,
                }))}
                handleSetValue={(item) =>
                  handleLinkChange(index, "type", item.value)
                }
                zIndex={1000 - index}
              />
            </View>

            {/* URL Input with Unified Border */}
            <View
              style={tw.style(
                `flex-1 flex-row items-center border border-neutral-200 rounded-sm overflow-hidden bg-[#FAFAFA] h-[45px]`,
                !link.type && `opacity-50`,
              )}
            >
              <View
                style={tw`w-[60px] h-full justify-center items-center border-r border-neutral-200 bg-[#F9FAFB]`}
              >
                <Text
                  style={tw`text-[10px] text-neutral-400 font-sans-regular`}
                >
                  https://
                </Text>
              </View>
              <Input
                label=""
                keyboardType="url"
                onInputChange={(text: string) =>
                  handleLinkChange(index, "url", text)
                }
                placeHolder={`Profile Link (${
                  socialOptions.find((opt) => opt.value === link.type)?.label ||
                  "handle name"
                })`}
                value={displayUrl}
                disabled={!link.type}
                containerStyle={tw`flex-1`}
                inputStyle={tw`border-0 bg-transparent h-full py-0 px-2 text-sm`}
              />
            </View>

            {/* Trash Button */}
            <TouchableOpacity
              onPress={() => removeLink(index)}
              style={tw`p-2 rounded-sm h-[45px] justify-center`}
            >
              <FontAwesome6 name="trash-can" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity
        onPress={addLink}
        disabled={links.length >= socialOptions.length}
        style={{
          opacity: links.length >= socialOptions.length ? 0.5 : 1,
        }}
      >
        <Text style={tw`text-sm text-purple-800 font-sans-medium`}>
          + Add Another Social media handle
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Socials;
