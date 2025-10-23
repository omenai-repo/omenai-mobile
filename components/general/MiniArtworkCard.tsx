import { View } from 'react-native'
import React from 'react'
import tw from 'twrnc'

export default function MiniArtworkCard() {
  return (
    <View style={tw`px-[10px] w-full`}>
      <View style={tw`w-full h-[250px] bg-[#eee]`} />
      <View style={tw`mt-[10px] flex-row gap-[10px]`}>
        <View style={tw`flex-1`}>
          <View style={tw`h-[10px] w-full bg-[#eee]`} />
          <View style={tw`h-[10px] mt-[10px] w-1/2 bg-[#eee]`} />
        </View>
      </View>
    </View>
  )
}
