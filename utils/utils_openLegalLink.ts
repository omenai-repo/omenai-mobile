import { openBrowserAsync } from 'expo-web-browser';
import type { updateModalProps } from 'store/modal/modalStore';

type LegalEntity = 'artist' | 'gallery' | 'collector';

type UpdateModal = (e: updateModalProps) => void;

export const openLegalLink = async (entity: LegalEntity, updateModal: UpdateModal) => {
  try {
    await openBrowserAsync(`https://omenai.app/legal?ent=${entity}`);
  } catch {
    updateModal({
      showModal: true,
      modalType: 'error',
      message: 'Something went wrong while opening the Terms of Agreement.',
    });
  }
};

