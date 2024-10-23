import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../assets/other/loader-animation.json';

export default function Loader({size = 200, height = 500}:{size?: number, height?: number}) {
    const animation = useRef(null);

    return (
        <View style={[styles.loadingContainer, {height: height}]}>
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
        alignItems: 'center',
        justifyContent: 'center'
    }
})