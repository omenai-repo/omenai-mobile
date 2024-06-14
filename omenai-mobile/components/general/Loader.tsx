import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../assets/other/loader-animation.json';

export default function Loader() {
    const animation = useRef(null);

    return (
        <View style={styles.loadingContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 200,
                    height: 200
                }}
                source={loaderAnimation}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        height: 500,
        alignItems: 'center',
        justifyContent: 'center'
    }
})