import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import React from 'react';
import { colors } from 'config/colors.config';
import { useModalStore } from 'store/modal/modalStore';
import { MaterialIcons } from '@expo/vector-icons';
import CancelSubscriptionModal from './modals/CancelSubscriptionModal';

// type ModalProps = {
//     message: string,
//     isVisible: boolean,
//     modalType: modalType
// }

export default function CustomModal() {
  const { showModal, modalMessage, modalType, retainModal } = useModalStore();

  const modals: { [key: string]: React.ReactElement } = {
    cancleSubscription: <CancelSubscriptionModal />,
  };

  return (
    <Modal
      isVisible={showModal}
      backdropOpacity={0.2}
      animationIn={retainModal !== null ? 'slideInUp' : 'slideInDown'}
      animationOut={retainModal !== null ? 'slideOutDown' : 'slideOutUp'}
    >
      {!retainModal && (
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 10,
                backgroundColor: '#eee',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {modalType === 'error' && (
                <MaterialIcons name="error-outline" color={'#ff0000'} size={20} />
              )}
              {modalType === 'success' && (
                <MaterialIcons name="check-circle-outline" color={'#008000'} size={20} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, color: colors.primary_black }}>{modalMessage}</Text>
            </View>
          </View>
        </View>
      )}
      {retainModal !== null && <>{modals[retainModal]}</>}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 50,
  },
});
