import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AuthTabs from '../../../../components/auth/AuthTabs'
import IndividualForm from './individual/IndividualForm';
import GalleryForm from './gallery/GalleryForm';

export default function InputForm() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <View style={{flex: 1}}>
            <AuthTabs
                tabs={['As an individual', 'As a gallery']}
                stateIndex={selectedIndex}
                handleSelect={e => setSelectedIndex(e)}
            />
            {selectedIndex === 0 && <IndividualForm/>}
            {selectedIndex === 1 && <GalleryForm />}
        </View>
    )
}

const styles = StyleSheet.create({})