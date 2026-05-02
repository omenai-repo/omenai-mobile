import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import tw from "twrnc";
import { getEditorialImageFilePreview } from "#lib/editorial/lib/getEditorialImageFilePreview";
import {
  canFetchFullEditorial,
  editorialNeedsRemoteFetch,
  editorialRowToArticle,
  fetchEditorialDocument,
} from "#lib/editorial/lib/fetchEditorialDocument";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import BlurStatusBar from "#components/general/BlurStatusBar";
import ArticleDetailSkeleton from "./ArticleDetailSkeleton";

const ArticleScreen = () => {
  const { article: routeArticle } = useRoute().params as {
    article: EditorialSchemaTypes;
  };
  const articleRecord = routeArticle as unknown as Record<string, unknown>;

  const needsRemote = editorialNeedsRemoteFetch(routeArticle);
  const canFetch = canFetchFullEditorial(articleRecord);

  const detailQueryKey = useMemo(
    () => [
      "editorial-detail",
      String(articleRecord.$id ?? ""),
      String(routeArticle.slug ?? ""),
    ],
    [articleRecord.$id, routeArticle.slug],
  );

  const { data: fetchedArticle, isLoading, isError } = useQuery({
    queryKey: detailQueryKey,
    queryFn: async () => {
      const res = await fetchEditorialDocument(articleRecord);
      if (!res.isOk) return null;
      return editorialRowToArticle(res.data);
    },
    enabled: needsRemote && canFetch,
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  const article = useMemo(() => {
    if (!needsRemote) return routeArticle;
    if (fetchedArticle) {
      return { ...routeArticle, ...fetchedArticle };
    }
    return routeArticle;
  }, [needsRemote, routeArticle, fetchedArticle]);

  const { width } = useWindowDimensions();
  const imageUrl = getEditorialImageFilePreview(article.cover, 1000);
  const insets = useSafeAreaInsets();

  if (needsRemote && !canFetch) {
    return (
      <View style={[tw`flex-1 bg-white items-center justify-center`, { paddingTop: insets.top }]}>
        <BlurStatusBar />
        <Text style={tw`text-neutral-500 px-6 text-center font-sans-regular`}>
          {`This editorial could not be opened. Please contact support if this keeps happening.`}
        </Text>
      </View>
    );
  }

  if (needsRemote && isLoading) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BlurStatusBar />
        <ArticleDetailSkeleton contentTopInset={insets.top} />
      </View>
    );
  }

  if (needsRemote && isError) {
    return (
      <View style={[tw`flex-1 bg-white items-center justify-center`, { paddingTop: insets.top }]}>
        <BlurStatusBar />
        <Text style={tw`text-neutral-500 px-6 text-center font-sans-regular`}>
          Could not load this editorial. Go back and open it again, or try again later.
        </Text>
      </View>
    );
  }

  if (needsRemote && !fetchedArticle) {
    return (
      <View style={[tw`flex-1 bg-white items-center justify-center`, { paddingTop: insets.top }]}>
        <BlurStatusBar />
        <Text style={tw`text-neutral-500 px-6 text-center font-sans-regular`}>
          Editorial unavailable.
        </Text>
      </View>
    );
  }

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
