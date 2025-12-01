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
import { getEditorialImageFilePreview } from "lib/editorial/lib/getEditorialImageFilePreview";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurStatusBar from "components/general/BlurStatusBar";

dayjs.extend(relativeTime);

type Props = {
  article: EditorialSchemaTypes;
};

const getReadTime = (content: string) => {
  const wordCount = content?.split(/\s+/)?.length || 0;
  return Math.ceil(wordCount / 200);
};

const ArticleScreen = () => {
  const { article } = useRoute().params as { article: EditorialSchemaTypes };
  const { width } = useWindowDimensions();
  const imageUrl = getEditorialImageFilePreview(article.cover, 1000);
  const insets = useSafeAreaInsets();

  const formattedDate = article.date
    ? dayjs(article.date).format("MMMM D, YYYY")
    : "";

  const readTime = getReadTime(article.content);

  return (
    <View style={tw`flex-1 bg-white`}>
      <BlurStatusBar />
      <ScrollView style={{ paddingTop: insets.top + 16 }}>
        <Image
          source={{ uri: imageUrl }}
          style={tw`w-full h-80 px-4`}
          resizeMode="cover"
        />

        <View style={tw`px-4 mt-4`}>
          <Text style={tw`text-black text-2xl font-bold leading-tight`}>
            {article.headline}
          </Text>

          <Text style={tw`text-black text-sm mt-2`}>
            By Iyanuoluwa Adenle • {formattedDate} • {readTime} min read
          </Text>

          {!!article.summary && (
            <Text style={tw`text-black text-base mt-4`}>{article.summary}</Text>
          )}
        </View>

        <View style={tw`px-4 mt-6 mb-[50px]`}>
          <RenderHtml
            contentWidth={width}
            source={{ html: article.content || "" }}
            baseStyle={{
              color: "black",
              fontSize: 16,
              lineHeight: 26,
            }}
            tagsStyles={{
              p: {
                marginBottom: 16,
              },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ArticleScreen;
