import { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { getArtistCurrencySymbol } from 'utils/utils_getArtistCurrencySymbol';
import { getArtworkPriceForArtist } from 'services/artworks/getArtworkPriceForArtist';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { useAppStore } from 'store/app/appStore';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/other/loader-animation.json';
import { extractNumberString } from 'utils/utils_editStringToNumber';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';

export default function ArtworkPriceReviewScreen({ onConfirm }: { onConfirm: () => void }) {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const { updateModal } = useModalStore();
  const { setActiveIndex, activeIndex, updateArtworkUploadData, artworkUploadData, clearData } =
    uploadArtworkStore();
  const { userSession } = useAppStore();
  const animation = useRef<LottieView | null>(null);

  // consent states like web
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [penaltyConsent, setPenaltyConsent] = useState(false);
  const [priceConsent, setPriceConsent] = useState(false);

  const canProceed = acknowledgment && penaltyConsent && priceConsent;

  // prepare query inputs
  const heightNum = Number.parseFloat(extractNumberString(artworkUploadData.height));
  const widthNum = Number.parseFloat(extractNumberString(artworkUploadData.width));

  // Use tanstack/react-query for fetching price
  const {
    data: priceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'fetch_artwork_price',
      artworkUploadData.medium,
      userSession?.categorization,
      userSession?.base_currency,
      heightNum,
      widthNum,
    ],
    queryFn: async () => {
      const response = await getArtworkPriceForArtist({
        medium: artworkUploadData.medium,
        category: userSession.categorization,
        currency: userSession.base_currency,
        height: heightNum,
        width: widthNum,
      });

      if (!response?.isOk) {
        throw new Error(response?.data?.message || 'Failed to fetch price');
      }

      // update upload store with returned price fields so rest of flow can use it
      updateArtworkUploadData('price', response.data.price);
      updateArtworkUploadData('usd_price', response.data.usd_price);
      updateArtworkUploadData('currency', response.data.currency);
      updateArtworkUploadData('shouldShowPrice', response.data.shouldShowPrice);

      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // handle the in-app opening of Terms/Legal link
  const openTerms = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://omenai.app/legal?ent=artist');
    } catch {
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Something went wrong while opening the Terms of Agreement.',
      });
    }
  };

  // Upload/confirm handler for mobile — call onConfirm only when all consents are accepted
  const handleConfirmPress = () => {
    if (!canProceed) {
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Please accept all conditions before uploading.',
      });
      return;
    }
    // call the passed in onConfirm (which in your flow probably triggers the upload)
    onConfirm();
  };

  if (isLoading) {
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
        <Text style={tw`text-lg font-semibold`}>Determining price of art piece...</Text>
      </View>
    );
  }

  if (isError || !priceData) {
    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={tw`text-red-500 text-center mb-4`}>
          Failed to load price. Please try again.
        </Text>
        <View style={tw`flex-row gap-4`}>
          <Pressable onPress={() => refetch()} style={tw`px-4 py-2 bg-black rounded-xl`}>
            <Text style={tw`text-white`}>Retry</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={tw`px-4 py-2 bg-white border border-gray-300 rounded-xl`}
          >
            <Text style={tw`text-black`}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F7F7] px-6 py-8 mb-[40px]`}>
      <Text style={tw`text-xl font-bold mb-4`}>Proposed Artwork Price</Text>

      <View style={tw`bg-white rounded-xl p-5 border border-[#00000020] mb-6`}>
        <Text style={tw`text-sm text-gray-600 mb-1`}>Omenai will list your art piece for:</Text>
        <Text style={tw`text-2xl font-bold text-black`}>
          {priceData?.usd_price ? `$${Number(priceData.usd_price).toLocaleString()}` : '-'}
        </Text>

        <Text style={tw`text-sm mt-3 text-gray-500`}>
          ({userSession.base_currency} equivalent: {getArtistCurrencySymbol(priceData.currency)}{' '}
          {Number(priceData.price).toLocaleString(undefined, { maximumFractionDigits: 2 })})
        </Text>
      </View>

      <Text style={tw`text-gray-600 text-sm mb-6`}>
        If you agree with the price, you can proceed to upload your piece. If not, tap cancel to
        review your details.
      </Text>

      {/* Exclusivity / terms alert (mimics web Alert) */}
      <View style={tw`bg-[#FFF3CD] border border-[#FFEEBA] rounded-[16px] px-4 py-5 mb-6`}>
        <View style={tw`flex-row items-center mb-5`}>
          <Ionicons name="warning-outline" size={20} color="#856404" style={tw`mr-3`} />
          <Text style={tw`text-[#856404] font-semibold`}>Exclusivity Agreement</Text>
        </View>
        <View style={tw`flex-1`}>
          {/* Price consent */}
          <Pressable
            onPress={() => setPriceConsent((s) => !s)}
            style={tw`flex-row items-start gap-3 mb-3`}
          >
            <View
              style={tw.style(
                `w-5 h-5 rounded-sm border border-[#856404] items-center justify-center`,
                priceConsent ? `bg-black` : `bg-white`,
              )}
            >
              {priceConsent ? <Text style={tw`text-white`}>✓</Text> : null}
            </View>
            <Text style={tw`text-[#856404] text-sm flex-1`}>
              I accept the price stipulated for this artwork and agree to have it listed on the
              platform at this price. I understand that I may cancel this upload if I do not agree.
            </Text>
          </Pressable>

          {/* Acknowledgment with link to Terms */}
          <Pressable
            onPress={() => setAcknowledgment((s) => !s)}
            style={tw`flex-row items-start gap-3 mb-3`}
          >
            <View
              style={tw.style(
                `w-5 h-5 rounded-sm border border-[#856404] items-center justify-center`,
                acknowledgment ? `bg-black` : `bg-white`,
              )}
            >
              {acknowledgment ? <Text style={tw`text-white`}>✓</Text> : null}
            </View>

            <Text style={tw`text-[#856404] text-sm flex-1`}>
              I acknowledge that this artwork is subject to a 90-day exclusivity period with Omenai
              as stipulated in the{' '}
              <Text onPress={openTerms} style={tw`underline font-semibold`}>
                Terms of Agreement
              </Text>{' '}
              and may not be sold through external channels during this time.
            </Text>
          </Pressable>

          {/* Penalty consent with link */}
          <Pressable
            onPress={() => setPenaltyConsent((s) => !s)}
            style={tw`flex-row items-start gap-3`}
          >
            <View
              style={tw.style(
                `w-5 h-5 rounded-sm border border-[#856404] items-center justify-center`,
                penaltyConsent ? `bg-black` : `bg-white`,
              )}
            >
              {penaltyConsent ? <Text style={tw`text-white`}>✓</Text> : null}
            </View>

            <Text style={tw`text-[#856404] text-sm flex-1`}>
              I agree that any breach of this exclusivity obligation will result in a 10% penalty
              fee deducted from my next successful sale on the platform as stipulated in the{' '}
              <Text onPress={openTerms} style={tw`underline font-semibold`}>
                Terms of Agreement
              </Text>
              .
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={tw`flex-row items-center justify-between mb-2`}>
        <Text style={tw`text-gray-500 text-sm`}>
          Acknowledgment: {acknowledgment ? '✔️' : '❌'} | Penalty: {penaltyConsent ? '✔️' : '❌'} |
          Price:
          {priceConsent ? '✔️' : '❌'}
        </Text>
      </View>

      <View style={tw`flex-row gap-4 mt-4`}>
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
          onPress={handleConfirmPress}
          style={tw.style(
            `flex-1 py-3 rounded-xl justify-center items-center`,
            canProceed ? `bg-black` : `bg-[#22222260]`,
          )}
          disabled={!canProceed}
        >
          <Text style={tw`text-white font-semibold`}>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
}
