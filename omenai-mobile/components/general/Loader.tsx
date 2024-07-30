import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../assets/other/loader-animation.json';

export default function Loader({size = 200}:{size?: number}) {
    const animation = useRef(null);

    return (
        <View style={styles.loadingContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: size,
                    height: size
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