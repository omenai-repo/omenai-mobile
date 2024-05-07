import { StyleSheet, View } from 'react-native'
import React from 'react';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthTabs from '../../components/auth/AuthTabs';

export default function Login() {
    return (
        <View style={styles.container}>
            <AuthHeader />
            <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
                <AuthTabs />
            </View>
        </View>
    )  
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        backgroundColor: '#fff',
        flex: 1
    }
})