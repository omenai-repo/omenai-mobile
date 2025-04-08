import { View, Text } from 'react-native';
import React from 'react';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import Input from 'components/inputs/Input';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import tw from 'twrnc';

const AddPrimaryAcctScreen = () => {
  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Add Primary Account" />

      <View style={tw`mx-[20px] mt-[40px] gap-[20px]`}>
        <CustomSelectPicker
          data={[]}
          placeholder="Select country"
          value={'Nigeria'}
          handleSetValue={() => {}}
          label="Country of account origin"
          search={true}
          searchPlaceholder="Search Country"
          dropdownPosition="bottom"
          disable={true}
        />

        <CustomSelectPicker
          data={[]}
          placeholder="Select bank name"
          value={'Union Bank'}
          handleSetValue={() => {}}
          label="Bank Name"
          search={true}
          searchPlaceholder="Search bank"
          dropdownPosition="bottom"
          disable={true}
        />

        <Input
          label={'Account name'} // Capitalize label
          keyboardType="default"
          onInputChange={(text) => {}}
          placeHolder={`Enter acct name`}
          value={''}
          errorMessage={''}
          containerStyle={{ flex: 0 }}
        />

        <Input
          label={'Account number'} // Capitalize label
          keyboardType="default"
          onInputChange={(text) => {}}
          placeHolder={`Enter acct number`}
          value={''}
          errorMessage={''}
          containerStyle={{ flex: 0 }}
        />
      </View>

      <View style={tw`mt-[50px] mx-[20px]`}>
        <FittedBlackButton onClick={() => {}} value="Add Account" height={50} />
      </View>
    </View>
  );
};

export default AddPrimaryAcctScreen;
