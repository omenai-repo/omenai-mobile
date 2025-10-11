import { Dimensions, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import React, { memo, useState, useEffect, useMemo } from 'react';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import LikeComponent from './LikeComponent';
import tw from 'twrnc';
import { fontNames } from 'constants/fontNames.constants';
import { getNumberOfColumns } from 'utils/utils_screen';
import MiniImage from './MiniImage';
import * as WebBrowser from 'expo-web-browser';
import { extendArtworkExclusivity } from 'services/artworks/extendArtworkExclusivity';
import { useModalStore } from 'store/modal/modalStore';

type MiniArtworkCardType = {
  title: string;
  url: string;
  price: number;
  artist: string;
  showPrice?: boolean;
  art_id: string;
  impressions: number;
  like_IDs: string[];
  galleryView?: boolean;
  availability: boolean;
  countdown?: Date | null;
};

// Countdown Timer Component
const ExclusivityCountdown = memo(({ expiresAt, art_id }: { expiresAt: Date; art_id: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { updateModal } = useModalStore();

  const [acknowledgment, setAcknowledgment] = useState(false);
  const [penaltyConsent, setPenaltyConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFormValid = acknowledgment && penaltyConsent;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [expiresAt]);

  const formatTime = (value: number) => String(value).padStart(2, '0');

  const handleExtendContract = async () => {
    setShowModal(true);
  };

  const handleExtension = async () => {
    if (!isFormValid) {
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Please accept both terms to continue.',
      });
      return;
    }

    setLoading(true);
    try {
      if (!art_id) {
        updateModal({
          showModal: true,
          modalType: 'error',
          message: 'Invalid artwork ID. Please try again.',
        });
        return;
      }

      const result = await extendArtworkExclusivity(art_id);

      if (!result || !result.isOk) {
        updateModal({
          showModal: true,
          modalType: 'error',
          message: result?.message || 'Failed to extend exclusivity. Please try again later.',
        });
        return;
      }

      updateModal({
        showModal: true,
        modalType: 'success',
        message: 'Exclusivity period successfully extended by 90 days.',
      });
      setIsExpired(false);
      setShowModal(false);
      setAcknowledgment(false);
      setPenaltyConsent(false);
    } catch (error) {
      console.error('extendContract error', error);
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isExpired) {
    return (
      <>
        <View style={tw`bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2`}>
          <View style={tw`flex-row items-start gap-2 mb-2`}>
            <View style={tw`w-3 h-3 bg-amber-500 rounded-full mt-0.5`} />
            <Text
              style={[
                tw`text-amber-800 text-xs flex-1`,
                { fontFamily: fontNames.dmSans + 'Regular' },
              ]}
            >
              Exclusivity ended. You may sell outside platform.
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleExtendContract}
            style={tw`bg-[#1A1A1A] py-2 px-3 rounded-md`}
            activeOpacity={0.8}
          >
            <Text
              style={[
                tw`text-white text-xs text-center`,
                { fontFamily: fontNames.dmSans + 'Medium' },
              ]}
            >
              Extend Contract
            </Text>
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!loading) setShowModal(false);
          }}
        >
          <View style={tw`flex-1 bg-black/50 justify-center items-center px-5`}>
            <View style={tw`bg-white rounded-xl p-5 w-full max-w-md`}>
              {/* Header */}
              <View style={tw`mb-3`}>
                <Text
                  style={[
                    tw`text-lg font-bold text-[#1A1A1A] mb-1`,
                    { fontFamily: fontNames.dmSans + 'Bold' },
                  ]}
                >
                  Extend Artwork Exclusivity Contract
                </Text>
                <Text
                  style={[
                    tw`text-sm text-[#1A1A1A]/70`,
                    { fontFamily: fontNames.dmSans + 'Regular' },
                  ]}
                >
                  Review and accept the terms below to renew your artwork's 90-day exclusivity
                  period.
                </Text>
              </View>

              {/* Notice Card */}
              <View style={tw`relative bg-[#1A1A1A] rounded-lg p-4 mb-4`}>
                {/* decorative circles */}
                <View
                  style={tw`absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16`}
                />
                <View
                  style={tw`absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12`}
                />
                <View style={tw`flex-row items-start gap-3`}>
                  <View style={tw`w-10 h-10 bg-white/20 rounded-lg items-center justify-center`}>
                    <Text style={tw`text-white`}>i</Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text
                      style={[
                        tw`font-semibold text-white mb-1`,
                        { fontFamily: fontNames.dmSans + 'Medium' },
                      ]}
                    >
                      Contract Extension
                    </Text>
                    <Text
                      style={[
                        tw`text-sm text-white/90`,
                        { fontFamily: fontNames.dmSans + 'Regular' },
                      ]}
                    >
                      This action will renew the 90-day exclusivity period, starting from today.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Terms Section */}
              <View style={tw`mb-3`}>
                <View style={tw`flex-row items-center gap-3 mb-2`}>
                  <View style={tw`w-1 h-5 bg-[#1A1A1A] rounded-full`} />
                  <Text
                    style={[
                      tw`text-base font-semibold`,
                      { fontFamily: fontNames.dmSans + 'Medium' },
                    ]}
                  >
                    Agreement Terms
                  </Text>
                </View>

                {/* Checkbox 1 */}
                <TouchableOpacity
                  onPress={() => setAcknowledgment((v) => !v)}
                  activeOpacity={0.9}
                  style={[
                    tw`bg-white border rounded-lg p-3 mb-2`,
                    acknowledgment ? tw`border-[#1A1A1A] shadow-md` : tw`border-gray-200`,
                  ]}
                >
                  <View style={tw`flex-row items-start gap-3`}>
                    <View style={tw`mt-1`}>
                      <View
                        style={[
                          tw`w-5 h-5 rounded-sm border items-center justify-center`,
                          acknowledgment ? tw`bg-[#1A1A1A] border-[#1A1A1A]` : tw`border-gray-300`,
                        ]}
                      >
                        {acknowledgment && <Text style={tw`text-white`}>✓</Text>}
                      </View>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={[tw`text-sm`, { fontFamily: fontNames.dmSans + 'Regular' }]}>
                        I acknowledge that this artwork will be subject to a{' '}
                        <Text style={[{ fontFamily: fontNames.dmSans + 'Bold' }]}>
                          90-day exclusivity period
                        </Text>{' '}
                        with Omenai and cannot be sold through external channels during this time.
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Checkbox 2 */}
                <TouchableOpacity
                  onPress={() => setPenaltyConsent((v) => !v)}
                  activeOpacity={0.9}
                  style={[
                    tw`bg-white border rounded-lg p-3`,
                    penaltyConsent ? tw`border-[#1A1A1A] shadow-md` : tw`border-gray-200`,
                  ]}
                >
                  <View style={tw`flex-row items-start gap-3`}>
                    <View style={tw`mt-1`}>
                      <View
                        style={[
                          tw`w-5 h-5 rounded-sm border items-center justify-center`,
                          penaltyConsent ? tw`bg-[#1A1A1A] border-[#1A1A1A]` : tw`border-gray-300`,
                        ]}
                      >
                        {penaltyConsent && <Text style={tw`text-white`}>✓</Text>}
                      </View>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={[tw`text-sm`, { fontFamily: fontNames.dmSans + 'Regular' }]}>
                        I understand that any breach of this exclusivity agreement will result in a{' '}
                        <Text style={[{ fontFamily: fontNames.dmSans + 'Bold' }]}>
                          10% penalty fee
                        </Text>{' '}
                        deducted from my next successful sale on the platform.
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Status Row */}
              <View
                style={tw`flex-row items-center justify-center text-xs text-gray-500 gap-3 mb-3`}
              >
                <View style={tw`flex-row items-center gap-1 ${acknowledgment ? '' : ''}`}>
                  <Text style={[tw`${acknowledgment ? 'text-green-600' : 'text-gray-400'}`]}>
                    ✓
                  </Text>
                  <Text
                    style={[
                      tw`${acknowledgment ? 'text-green-600' : 'text-gray-400'}`,
                      { fontFamily: fontNames.dmSans + 'Regular' },
                    ]}
                  >
                    Acknowledged
                  </Text>
                </View>
                <Text style={tw`text-gray-300`}>|</Text>
                <View style={tw`flex-row items-center gap-1`}>
                  <Text style={[tw`${penaltyConsent ? 'text-green-600' : 'text-gray-400'}`]}>
                    ✓
                  </Text>
                  <Text
                    style={[
                      tw`${penaltyConsent ? 'text-green-600' : 'text-gray-400'}`,
                      { fontFamily: fontNames.dmSans + 'Regular' },
                    ]}
                  >
                    Penalty Consent
                  </Text>
                </View>
              </View>

              {/* Action Button */}
              <View>
                <TouchableOpacity
                  disabled={!isFormValid || loading}
                  onPress={handleExtension}
                  activeOpacity={0.9}
                  style={[
                    tw`w-full h-11 rounded items-center justify-center`,
                    isFormValid && !loading ? tw`bg-black` : tw`bg-gray-300`,
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[tw`text-white`, { fontFamily: fontNames.dmSans + 'Medium' }]}>
                      Confirm & Extend Contract
                    </Text>
                  )}
                </TouchableOpacity>

                {!isFormValid && (
                  <Text
                    style={[
                      tw`text-center text-sm text-[#1A1A1A]/70 mt-3`,
                      { fontFamily: fontNames.dmSans + 'Regular' },
                    ]}
                  >
                    Please accept both terms to continue
                  </Text>
                )}

                {/* Cancel */}
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => !loading && setShowModal(false)}
                  style={tw`mt-3 items-center`}
                >
                  <Text
                    style={[
                      tw`text-sm text-[#1A1A1A]/70`,
                      { fontFamily: fontNames.dmSans + 'Medium' },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <View style={tw`bg-[#1A1A1A]/5 rounded-lg p-2 mt-2 border border-[#1A1A1A]/10`}>
      <View style={tw`flex-row items-center gap-1 mb-1.5`}>
        <View style={tw`w-1.5 h-1.5 bg-green-500 rounded-full`} />
        <Text
          style={[tw`text-[#1A1A1A]/70 text-[10px]`, { fontFamily: fontNames.dmSans + 'Medium' }]}
        >
          Ends in:
        </Text>
      </View>
      <View style={tw`flex-row gap-1`}>
        {timeLeft.days > 0 && (
          <View style={tw`bg-white rounded px-1.5 py-1 flex-1 items-center shadow-sm`}>
            <Text
              style={[
                tw`text-[#1A1A1A] font-semibold text-xs`,
                { fontFamily: fontNames.dmSans + 'Bold' },
              ]}
            >
              {formatTime(timeLeft.days)}
            </Text>
            <Text
              style={[
                tw`text-[#1A1A1A]/50 text-[8px]`,
                { fontFamily: fontNames.dmSans + 'Regular' },
              ]}
            >
              D
            </Text>
          </View>
        )}
        <View style={tw`bg-white rounded px-1.5 py-1 flex-1 items-center shadow-sm`}>
          <Text
            style={[
              tw`text-[#1A1A1A] font-semibold text-xs`,
              { fontFamily: fontNames.dmSans + 'Bold' },
            ]}
          >
            {formatTime(timeLeft.hours)}
          </Text>
          <Text
            style={[tw`text-[#1A1A1A]/50 text-[8px]`, { fontFamily: fontNames.dmSans + 'Regular' }]}
          >
            H
          </Text>
        </View>
        <View style={tw`bg-white rounded px-1.5 py-1 flex-1 items-center shadow-sm`}>
          <Text
            style={[
              tw`text-[#1A1A1A] font-semibold text-xs`,
              { fontFamily: fontNames.dmSans + 'Bold' },
            ]}
          >
            {formatTime(timeLeft.minutes)}
          </Text>
          <Text
            style={[tw`text-[#1A1A1A]/50 text-[8px]`, { fontFamily: fontNames.dmSans + 'Regular' }]}
          >
            M
          </Text>
        </View>
        <View style={tw`bg-white rounded px-1.5 py-1 flex-1 items-center shadow-sm`}>
          <Text
            style={[
              tw`text-[#1A1A1A] font-semibold text-xs`,
              { fontFamily: fontNames.dmSans + 'Bold' },
            ]}
          >
            {formatTime(timeLeft.seconds)}
          </Text>
          <Text
            style={[tw`text-[#1A1A1A]/50 text-[8px]`, { fontFamily: fontNames.dmSans + 'Regular' }]}
          >
            S
          </Text>
        </View>
      </View>
    </View>
  );
});

const MiniArtworkCard = memo(
  ({
    url,
    artist,
    title,
    showPrice,
    price,
    art_id,
    impressions,
    like_IDs,
    galleryView = false,
    availability,
    countdown,
  }: MiniArtworkCardType) => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const screenWidth = Dimensions.get('window').width - 10;
    const dividerNum = getNumberOfColumns();
    let imageWidth = Math.round(screenWidth / dividerNum);
    const image_href = getImageFileView(url, imageWidth);

    const expiryDate = useMemo(() => (countdown ? new Date(countdown) : null), [countdown]);

    const showCountdown = !galleryView && expiryDate && availability;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={tw`flex flex-col pb-[20px]`}
        onPress={() => navigation.push(screenName.artwork, { title, url })}
      >
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
        <View style={tw`mt-3 w-full`}>
          <Text
            style={[
              tw`text-base font-medium text-[#1A1A1A]/90`,
              { fontFamily: fontNames.dmSans + 'Medium' },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              tw`text-sm text-[#1A1A1A]/70 my-1`,
              { fontFamily: fontNames.dmSans + 'Regular' },
            ]}
          >
            {artist}
          </Text>
          {availability ? (
            <Text
              style={[
                tw`text-base font-bold text-[#1A1A1A]/90`,
                { fontFamily: fontNames.dmSans + 'Bold' },
              ]}
            >
              {showPrice ? utils_formatPrice(price) : 'Price on request'}
            </Text>
          ) : (
            <Text
              style={[
                tw`text-base font-bold text-[#1A1A1A]/90`,
                { fontFamily: fontNames.dmSans + 'Bold' },
              ]}
            >
              Sold
            </Text>
          )}

          {/* Status Section - Only show for non-gallery view (artist dashboard) */}
          {!galleryView && (
            <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text
                  style={[tw`text-gray-600 text-xs`, { fontFamily: fontNames.dmSans + 'Regular' }]}
                >
                  Status:
                </Text>
                {availability ? (
                  <View style={tw`bg-green-50 px-2 py-1 rounded-full`}>
                    <Text
                      style={[
                        tw`text-green-700 text-xs`,
                        { fontFamily: fontNames.dmSans + 'Medium' },
                      ]}
                    >
                      Available
                    </Text>
                  </View>
                ) : (
                  <View style={tw`bg-red-50 px-2 py-1 rounded-full`}>
                    <Text
                      style={[
                        tw`text-red-700 text-xs`,
                        { fontFamily: fontNames.dmSans + 'Medium' },
                      ]}
                    >
                      Sold
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Countdown Timer */}
          {showCountdown && <ExclusivityCountdown expiresAt={expiryDate} art_id={art_id} />}
        </View>
      </TouchableOpacity>
    );
  },
);

export default MiniArtworkCard;
