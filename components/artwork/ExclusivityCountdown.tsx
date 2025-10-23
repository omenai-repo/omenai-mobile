import React, { memo, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { fontNames } from 'constants/fontNames.constants';
import ExclusivityExtensionModal from './ExclusivityExtensionModal';

interface ExclusivityCountdownProps {
  expiresAt: Date;
  art_id: string;
}

const TimeDisplay = ({ value, label }: { value: number; label: string }) => (
  <View style={tw`bg-white rounded px-1.5 py-1 flex-1 items-center shadow-sm`}>
    <Text
      style={[
        tw`text-[#1A1A1A] font-semibold text-xs`,
        { fontFamily: fontNames.dmSans + 'Bold' },
      ]}
    >
      {String(value).padStart(2, '0')}
    </Text>
    <Text
      style={[
        tw`text-[#1A1A1A]/50 text-[8px]`,
        { fontFamily: fontNames.dmSans + 'Regular' },
      ]}
    >
      {label}
    </Text>
  </View>
);

const ExpiredState = ({ onExtendContract }: { onExtendContract: () => void }) => (
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
      onPress={onExtendContract}
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
);

const ActiveCountdown = ({ timeLeft }: { timeLeft: { days: number; hours: number; minutes: number; seconds: number } }) => (
  <View style={tw`bg-[#1A1A1A]/5 rounded-lg p-2 mt-2 border border-[#1A1A1A]/10`}>
    <View style={tw`flex-row items-center gap-1 mb-1.5`}>
      <View style={tw`w-1.5 h-1.5 bg-green-500 rounded-full`} />
      <Text
        style={[tw`text-[#1A1A1A]/70 text-[10px]`, { fontFamily: fontNames.dmSans + 'Medium' }]}
      >
        Exclusivity period ends in:
      </Text>
    </View>
    <View style={tw`flex-row gap-1`}>
      {timeLeft.days > 0 && <TimeDisplay value={timeLeft.days} label="D" />}
      <TimeDisplay value={timeLeft.hours} label="H" />
      <TimeDisplay value={timeLeft.minutes} label="M" />
      <TimeDisplay value={timeLeft.seconds} label="S" />
    </View>
  </View>
);

export default memo(function ExclusivityCountdown({ expiresAt, art_id }: ExclusivityCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleExtendContract = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleExtensionSuccess = () => {
    setIsExpired(false);
  };

  return (
    <>
      {isExpired ? (
        <ExpiredState onExtendContract={handleExtendContract} />
      ) : (
        <ActiveCountdown timeLeft={timeLeft} />
      )}

      <ExclusivityExtensionModal
        visible={showModal}
        onClose={handleModalClose}
        art_id={art_id}
        onSuccess={handleExtensionSuccess}
      />
    </>
  );
});
