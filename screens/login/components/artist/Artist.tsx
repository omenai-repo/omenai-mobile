import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LongBlackButton from '../../../../components/buttons/LongBlackButton';
import Input from '../../../../components/inputs/Input';
import { useGalleryAuthLoginStore } from 'store/auth/login/GalleryAuthLoginStore';
import PasswordInput from 'components/inputs/PasswordInput';
import WithModal from 'components/modal/WithModal';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';
import { loginAccount } from 'services/login/loginAccount';
import { utils_storeAsyncData } from 'utils/utils_asyncStorage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { screenName } from 'constants/screenNames.constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useArtistAuthLoginStore } from 'store/auth/login/ArtistAuthLoginStore';

export default function Artist() {
  const { artistLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useArtistAuthLoginStore();
  const { setUserSession, setIsLoggedIn, userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = async () => {
    setIsLoading(true);

    const results = await loginAccount(artistLoginData, 'artist');
    console.log(results);
    if (results?.isOk) {
      const resultsBody = results?.body?.data;

      if (!resultsBody) {
        setIsLoading(false);
        return;
      }

      const isVerified = Boolean(resultsBody.verified);

      if (!isVerified) {
        setIsLoading(false);
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.artist_id, type: 'artist' },
        });
        return;
      }

      const data = {
        id: resultsBody.artist_id,
        email: resultsBody.email,
        name: resultsBody.name,
        role: resultsBody.role,
        artist_verified: resultsBody.artist_verified,
        verified: resultsBody.verified,
        isOnboardingCompleted: resultsBody.isOnboardingCompleted,
        address: resultsBody.address,
        walletId: '0e77a519-e21d-4889-a602-8e8ba44e8597', //change later
      };

      const isStored = await utils_storeAsyncData('userSession', JSON.stringify(data));

      const loginTimeStamp = new Date();
      const isLoginTimeStampStored = await utils_storeAsyncData(
        'loginTimeStamp',
        JSON.stringify(loginTimeStamp),
      );

      if (isStored && isLoginTimeStampStored) {
        setUserSession(data);
        setIsLoggedIn(true);
        clearInputs();
      }
    } else {
      // Alert.alert(results?.body.message)
      updateModal({
        message: results?.body.message,
        showModal: true,
        modalType: 'error',
      });
    }

    setIsLoading(false);
  };

  return (
    <WithModal>
      <View style={styles.container}>
        <View style={{ gap: 20 }}>
          <Input
            label="Artist Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your email address"
            value={artistLoginData.email}
          />
          <PasswordInput
            label="Password"
            onInputChange={setPassword}
            placeHolder="Enter password"
            value={artistLoginData.password}
          />
        </View>
        <View>
          <LongBlackButton
            value={isLoading ? 'Loading ...' : 'Sign In Artist'}
            isDisabled={artistLoginData.email && artistLoginData.password ? false : true}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(screenName.forgotPassword, { type: 'artist' })}
        >
          <Text style={styles.resetText}>Forgot password? Click here</Text>
        </TouchableOpacity>
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 40,
  },
  resetText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
