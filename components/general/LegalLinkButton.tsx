import { Pressable, Text } from 'react-native';
import tw from 'twrnc';
import { openLegalLink } from 'utils/utils_openLegalLink';
import type { updateModalProps } from 'store/modal/modalStore';

type LegalLinkButtonProps = {
  entity: 'artist' | 'gallery' | 'collector';
  updateModal: (e: updateModalProps) => void;
};

export default function LegalLinkButton({ entity, updateModal }: LegalLinkButtonProps) {
  return (
    <Pressable onPress={() => openLegalLink(entity, updateModal)} style={tw`mt-[20px]`}>
      <Text style={tw`text-[14px] text-[#007AFF] text-center underline`}>
        Read our Privacy Policy and Terms of Use
      </Text>
    </Pressable>
  );
}

