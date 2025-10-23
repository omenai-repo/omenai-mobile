import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import MiniImage from './MiniImage';
import LikeComponent from './LikeComponent';

interface ArtworkImageProps {
  imageWidth: number;
  image_href: string;
  galleryView: boolean;
  art_id: string;
  impressions: number;
  like_IDs: string[];
}

export default function ArtworkImage({
  imageWidth,
  image_href,
  galleryView,
  art_id,
  impressions,
  like_IDs,
}: ArtworkImageProps) {
  return (
    <View style={tw`rounded-[5px] overflow-hidden relative`}>
      <View style={tw`w-full flex items-center justify-center`}>
        {MiniImage({ maxWidth: imageWidth, url: image_href })}
      </View>
      <View
        style={tw`absolute top-0 left-0 h-full w-[${
          imageWidth - 10
        }px] bg-black/20 flex items-end justify-end p-3`}
      >
        {galleryView && (
          <View
            style={tw`bg-white/20 h-[30px] w-[30px] rounded-full flex items-center justify-center`}
          >
            <LikeComponent
              art_id={art_id}
              impressions={impressions || 0}
              likeIds={like_IDs || []}
              lightText
            />
          </View>
        )}
      </View>
    </View>
  );
}
