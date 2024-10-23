import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { useModalStore } from 'store/modal/modalStore'

export default function WebViewModal({url}: {url: string | null}) {
    const { setWebViewUrl } = useModalStore()

    if(url)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <BackScreenButton cancle handleClick={() => setWebViewUrl(null)} />
            </View>
            <WebView source={{ uri: 'https://omenai-web.vercel.app/' + url }} style={{ flex: 1}} />
        </SafeAreaView>
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