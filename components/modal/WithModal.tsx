import { View } from 'react-native';
import React, { useEffect } from 'react';
import CustomModal from './CustomModal';
import { useModalStore } from 'store/modal/modalStore';
import { colors } from 'config/colors.config';
import ConfirmationModal from './ConfirmationModal';

export type WithModalProps = {
  children: React.ReactNode;
};

export default function WithModal({ children }: WithModalProps) {
  const { showModal, updateModal, confirmationModal, showConfirmationModal, retainModal } =
    useModalStore();

  useEffect(() => {
    if (showModal && retainModal === null) {
      const closeModal = () => {
        //close modal after 3.5 seconds
        setTimeout(() => {
          updateModal({ message: '', showModal: false, modalType: '' });
        }, 2500);
      };
      closeModal();
    }
  }, [showModal, retainModal, updateModal]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {children}
      <CustomModal />
      <ConfirmationModal isVisible={showConfirmationModal} child={confirmationModal} />
    </View>
  );
}
