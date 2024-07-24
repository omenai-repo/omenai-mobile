import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import { useModalStore } from 'store/modal/modalStore'
import { useNavigation, useRoute } from '@react-navigation/native';
import BackScreenButton from 'components/buttons/BackScreenButton';
import WebView from 'react-native-webview';
import Loader from 'components/general/Loader';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Editorial() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const routes = useRoute();

  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const { id, articleHeader } = routes.params as {id: string, articleHeader: string};
    console.log(id, articleHeader)
    setUrl(`/articles/${id}/${articleHeader}`)
  }, [])

  return (
    <WithModal>
      <SafeAreaView style={styles.container}>
          <View style={styles.topContainer}>
              <BackScreenButton handleClick={() => navigation.goBack()} />
          </View>
          <WebView 
            source={{ uri: 'https://omenai-web.vercel.app/' + url }} 
            style={{ flex: 1}} 
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{top: -300, position: 'relative'}}>
                <Loader />
              </View>
            )}
          />
      </SafeAreaView>
    </WithModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10
  }
})