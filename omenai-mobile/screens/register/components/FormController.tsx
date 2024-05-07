import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InputForm from './inputForm/InputForm'

export default function FormController() {
    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
            <InputForm />        
        </ScrollView>
    )
}

const styles = StyleSheet.create({})