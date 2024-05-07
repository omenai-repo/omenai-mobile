import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputForm from './inputForm/InputForm'
import Preferences from './preferences/Preferences';
import TermsAndConditions from './TermsAndConditions/TermsAndConditions';

export default function FormController() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
            {selectedIndex === 0 && 
                <InputForm 
                    handleNext={() => setSelectedIndex(prev => prev + 1)}
                />
            }
            {selectedIndex === 1 && 
                <Preferences 
                    handleBack={() => setSelectedIndex(prev => prev - 1)}
                    handleNext={() => setSelectedIndex(prev => prev + 1)}
                />
            }
            {selectedIndex === 2 &&
                <TermsAndConditions
                    handleBack={() => setSelectedIndex(prev => prev - 1)}
                />
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({})