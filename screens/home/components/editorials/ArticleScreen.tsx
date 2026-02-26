import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import tw from "twrnc";
import { getEditorialImageFilePreview } from "#lib/editorial/lib/getEditorialImageFilePreview";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { EditorialSchemaTypes } from "#types/types";

dayjs.extend(relativeTime);

const getReadTime = (content: string) => {
  const wordCount = content?.split(/\s+/)?.length || 0;
  return Math.ceil(wordCount / 200);
};

const ArticleScreen = () => {
  const { article } = useRoute().params as { article: EditorialSchemaTypes };
  const { width } = useWindowDimensions();
  const imageUrl = getEditorialImageFilePreview(article.cover, 1000);
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-white`}>
      <BlurStatusBar />
      <ScrollView style={{ paddingTop: insets.top }}>
        <Image
          source={{ uri: imageUrl }}
          style={tw`w-full h-80`}
          resizeMode="cover"
        />

        <View style={tw`px-5 mt-4`}>
          <Text
            style={tw`text-black font-serif text-3xl font-bold leading-tight`}
          >
            {article.headline}
          </Text>

          {!!article.summary && (
            <Text
              style={tw`text-neutral-500 font-serif-italic text-xl mt-4 leading-7`}
            >
              {article.summary}
            </Text>
          )}
        </View>

        <View style={tw`px-5 mt-6 mb-[50px]`}>
          <RenderHtml
            contentWidth={width}
            source={{ html: article.content || "" }}
            baseStyle={tw.style("text-neutral-800 font-sans-regular text-base")}
            tagsStyles={{
              p: tw.style("leading-8 mb-6 text-neutral-800"),
              h1: tw.style(
                "font-serif-italic font-light text-3xl mb-4 text-black",
              ),
              h2: tw.style(
                "font-serif-italic font-light text-2xl mb-4 text-black",
              ),
              h3: tw.style(
                "font-serif-italic font-light text-xl mb-3 text-black",
              ),
              strong: tw.style("font-sans-bold text-black"),
              a: tw.style("text-black underline"),
              blockquote: tw.style(
                "border-l-2 border-black pl-6 font-serif text-xl text-neutral-900 my-6",
              ),
              ul: tw.style("mb-6 pl-4"),
              ol: tw.style("mb-6 pl-4"),
              li: tw.style("leading-7 mb-2"),
              img: tw.style("my-8 rounded-sm"),
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ArticleScreen;
