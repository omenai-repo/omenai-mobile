import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthTabs from '../../components/auth/AuthTabs';
import Individual from './components/individual/Individual';
import Gallery from './components/gallery/Gallery';

export default function Login() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <View style={styles.container}>
            <AuthHeader />
            <ScrollView style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
                <AuthTabs
                    tabs={['As an individual', 'As a gallery']}
                    stateIndex={selectedIndex}
                    handleSelect={e => setSelectedIndex(e)}
                />
                {/* route depending on state */}
                {selectedIndex === 0 && <Individual />}
                {selectedIndex === 1 && <Gallery />}
            </ScrollView>
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