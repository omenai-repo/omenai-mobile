import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { getArtistCurrencySymbol } from 'utils/utils_getArtistCurrencySymbol';
import { getArtworkPriceForArtist } from 'services/artworks/getArtworkPriceForArtist';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { useAppStore } from 'store/app/appStore';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/other/loader-animation.json';

export default function ArtworkPriceReviewScreen({ onConfirm }: { onConfirm: () => void }) {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const { updateModal } = useModalStore();
  const { setActiveIndex, activeIndex, updateArtworkUploadData, artworkUploadData, clearData } =
    uploadArtworkStore();
  const { userSession } = useAppStore();
  const animation = useRef(null);

  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState<any>(null);

  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    try {
      console.log({
        medium: artworkUploadData.medium,
        category: userSession.categorization,
        currency: userSession.base_currency,
        height: artworkUploadData.height,
        width: artworkUploadData.width,
      });
      const response = await getArtworkPriceForArtist({
        medium: artworkUploadData.medium,
        category: userSession.categorization,
        currency: userSession.base_currency,
        height: artworkUploadData.height,
        width: artworkUploadData.width,
      });
      console.log(response);
      if (response?.isOk) {
        updateArtworkUploadData('price', response?.data.price);
        updateArtworkUploadData('usd_price', response?.data.usd_price);
        updateArtworkUploadData('currency', response?.data.currency);
        updateArtworkUploadData('shouldShowPrice', response?.data.shouldShowPrice);
        setPriceData(response?.data);
      } else {
        updateModal({
          message: response?.message || 'Failed to fetch price',
          modalType: 'error',
          showModal: true,
        });
      }
    } catch (error) {
      updateModal({
        message: 'Something went wrong while fetching price',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={tw.style(`flex-1 justify-center items-center`, {
          marginTop: height / 8,
        })}
      >
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
          }}
          source={loaderAnimation}
        />
        <Text style={tw`text-lg font-semibold`}>Calculating price...</Text>
      </View>
    );
  }

  if (!priceData) {
    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={tw`text-red-500 text-center`}>Failed to load price. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F7F7] px-6 py-8`}>
      <Text style={tw`text-xl font-bold mb-4`}>Proposed Artwork Price</Text>

      <View style={tw`bg-white rounded-xl p-5 border border-[#00000020] mb-6`}>
        <Text style={tw`text-sm text-gray-600 mb-1`}>Platform will list your artwork for:</Text>
        <Text style={tw`text-2xl font-bold text-black`}>
          {getArtistCurrencySymbol(priceData.currency)}{' '}
          {Number(priceData.price).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </Text>

        <Text style={tw`text-sm mt-3 text-gray-500`}>
          (USD equivalent: ${priceData.usd_price.toLocaleString()})
        </Text>
      </View>

      <Text style={tw`text-gray-600 text-sm mb-6`}>
        If you agree to this price, you can go ahead and upload your artwork. Otherwise, tap cancel
        to review your details.
      </Text>

      <View style={tw`flex-row gap-4`}>
        <Pressable
          onPress={() => {
            navigation.goBack();
            setActiveIndex(1);
            clearData();
          }}
          style={tw`flex-1 py-3 border border-gray-400 rounded-xl justify-center items-center`}
        >
          <Text style={tw`text-gray-700 font-semibold`}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={onConfirm}
          style={tw`flex-1 py-3 bg-black rounded-xl justify-center items-center`}
        >
          <Text style={tw`text-white font-semibold`}>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
}
