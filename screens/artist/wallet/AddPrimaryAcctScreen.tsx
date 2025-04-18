import { View, Text, TextInput } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import Input from 'components/inputs/Input';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import tw from 'twrnc';
import { fetchBanks } from 'services/wallet/fetchBanks';
import { debounce } from 'lodash';
import { useAppStore } from 'store/app/appStore';
import { validateBankAcct } from 'services/wallet/validateBankAct';
import { useModalStore } from 'store/modal/modalStore';
import { addPrimaryAcct } from 'services/wallet/addPrimaryAcct';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchBankBranches } from 'services/wallet/fetchBankBranches';
import WithModal from 'components/modal/WithModal';

type BankOption = {
  label: string;
  value: string;
  id?: string; // Add optional 'id' property
};

// Define the Bank type
type Bank = {
  name: string;
  code: string;
};

const supportedCountryCodes = [
  'BJ',
  'CM',
  'TD',
  'CI',
  'CG',
  'GA',
  'GH',
  'MW',
  'RW',
  'SN',
  'SL',
  'TZ',
  'UG',
  // 'NG',
];

const AddPrimaryAcctScreen = () => {
  const navigation = useNavigation();
  const { walletData } = useRoute().params as { walletData: any };
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [bankList, setBankList] = useState<BankOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [filteredBankList, setFilteredBankList] = useState<BankOption[]>([]);
  const [searchText, setSearchText] = useState('');
  const [branchSearchText, setBranchSearchText] = useState('');
  const [branchList, setBranchList] = useState<BankOption[]>([]);
  const [filteredBranchList, setFilteredBranchList] = useState<BankOption[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BankOption | null>(null);
  const [acctNumber, setAcctNumber] = useState('');
  const [acctName, setAcctName] = useState('');
  const [loadAcctName, setLoadAcctName] = useState(false);
  const [addPrimaryAcctLoading, setAddPrimaryAcctLoading] = useState(false);

  const fetchBankList = async () => {
    setIsLoading(true);
    try {
      const response = await fetchBanks();
      if (response?.isOk && Array.isArray(response?.data.banks)) {
        const formattedData: BankOption[] = response.data.banks
          .map((bank: Bank & { id: string }): BankOption & { id: string } => ({
            label: bank.name,
            value: bank.code,
            id: bank.id,
          }))
          .sort((a: BankOption, b: BankOption) => a.label.localeCompare(b.label));

        setBankList(formattedData);
        setFilteredBankList(formattedData); // Initialize filtered list
      }
    } catch (error) {
      console.error('Fetch bank error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text.trim().length < 3) {
      setFilteredBankList([]);
      return;
    }

    const filtered = bankList.filter((bank) =>
      bank.label.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredBankList(filtered);
  };

  // 🔁 NEW: fetch full list once when bank changes
  useEffect(() => {
    const fetchBranches = async () => {
      if (selectedBank?.value && supportedCountryCodes.includes(userSession.address.countryCode)) {
        try {
          const response = await fetchBankBranches(selectedBank.value);
          if (response?.isOk && Array.isArray(response?.data)) {
            const formatted = response.data
              .map((branch: any) => ({
                label: branch.branch_name,
                value: branch.branch_code,
                id: branch.id,
              }))
              .sort((a: BankOption, b: BankOption) => a.label.localeCompare(b.label));

            setBranchList(formatted);
            setFilteredBranchList(formatted);
          }
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      } else {
        setBranchList([]); // Reset if not supported
      }
    };

    fetchBranches();
  }, [selectedBank, userSession.address.countryCode]);

  const handleBranchSearch = (text: string) => {
    setBranchSearchText(text);
    if (text.trim().length < 2) return;

    const filtered = branchList.filter((branch) =>
      branch.label.toLowerCase().includes(text.toLowerCase()),
    );
    setBranchList(filtered);
    setFilteredBranchList(filtered);
  };

  const handleBranchSearchDebounced = useCallback(debounce(handleBranchSearch, 300), [
    selectedBank,
    userSession?.address?.countryCode,
  ]);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [bankList]);

  const handleAcctValidation = async () => {
    if (!selectedBank) {
      updateModal({
        message: 'Please select a bank',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    if (!acctNumber) {
      updateModal({
        message: 'Please enter account number',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    setLoadAcctName(true);
    // const response = await validateBankAcct(selectedBank.value, acctNumber);
    const response = await validateBankAcct('044', '0690000032');

    if (response?.isOk) {
      setAcctName(response.data.account_name);
    } else {
      updateModal({
        message: 'Invalid account number or bank code',
        showModal: true,
        modalType: 'error',
      });
    }
    setLoadAcctName(false);
  };

  const handleAddPrimaryAcct = async () => {
    if (acctName === '') {
      updateModal({
        message: 'Please validate account number first',
        showModal: true,
        modalType: 'error',
      });
      return;
    }
    setAddPrimaryAcctLoading(true);
    const response = await addPrimaryAcct({
      owner_id: userSession.id,
      account_details: {
        // bank_code: selectedBank?.value || '',
        bank_code: '044',
        // account_number: Number(acctNumber),
        account_number: '0690000032',
        account_name: acctName,
        bank_branch: selectedBranch?.value || '',
        bank_country: userSession.address.countryCode,
        bank_name: selectedBank?.label || '',
        bank_id: selectedBank?.id || '',
      },
      base_currency: walletData.base_currency,
    });
    console.log(response);
    if (response?.isOk) {
      updateModal({
        message: 'Primary account added successfully',
        showModal: true,
        modalType: 'success',
      });
      setAcctName('');
      setAcctNumber('');
      setSelectedBank(null);
      setSelectedBranch(null);
      setFilteredBankList([]);
      setBranchList([]);
      setSearchText('');
      navigation.goBack();
    } else {
      updateModal({
        message: 'Error adding primary account',
        showModal: true,
        modalType: 'error',
      });
    }
    setAddPrimaryAcctLoading(false);
  };

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Add Primary Account" />

        <View style={tw`mx-[20px] mt-[40px] gap-[20px]`}>
          <CustomSelectPicker
            data={
              userSession?.address
                ? [
                    {
                      label: userSession.address.country,
                      value: userSession.address.country,
                    },
                  ]
                : []
            }
            placeholder="Select country"
            value={userSession?.address ? userSession.address.country : 'Select country'}
            handleSetValue={() => {}}
            label="Country of account origin"
            disable={true}
          />

          <CustomSelectPicker
            data={filteredBankList}
            placeholder="Select bank name"
            value={selectedBank?.value || ''}
            renderInputSearch={() => (
              <TextInput
                placeholder="Search bank"
                value={searchText}
                style={{
                  padding: 15,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#fff',
                  margin: 5,
                }}
                onChangeText={(text: string) => {
                  setSearchText(text);
                  debouncedSearch(text);
                }}
              />
            )}
            handleSetValue={(item: { label: string; value: string }) => {
              setSelectedBank(item);
            }}
            label="Bank Name"
            search={true}
            searchPlaceholder="Search bank"
            dropdownPosition="bottom"
          />

          {supportedCountryCodes.includes(userSession.address.countryCode) && (
            <CustomSelectPicker
              data={filteredBranchList}
              placeholder="Select bank branch"
              value={selectedBranch?.value || ''}
              renderInputSearch={() => (
                <TextInput
                  placeholder="Search branch"
                  value={branchSearchText}
                  style={{
                    padding: 15,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    backgroundColor: '#fff',
                    margin: 5,
                  }}
                  onChangeText={(text: string) => {
                    handleBranchSearch(text);
                  }}
                />
              )}
              handleSetValue={(item: BankOption) => {
                setSelectedBranch(item);
              }}
              label="Bank Branch"
              search={true}
              searchPlaceholder="Search branch"
              dropdownPosition="bottom"
              disable={!selectedBank}
            />
          )}

          <Input
            label={'Account number'} // Capitalize label
            keyboardType="default"
            onInputChange={(text: string) => setAcctNumber(text)}
            placeHolder={`Enter acct number`}
            value={acctNumber}
            errorMessage={''}
            containerStyle={{ flex: 0 }}
          />

          {acctName && (
            <Input
              label={'Account name'}
              onInputChange={(text: string) => {}}
              value={acctName}
              disabled
              containerStyle={{ flex: 0 }}
            />
          )}
        </View>

        <View style={tw`mt-[50px] mx-[20px]`}>
          <FittedBlackButton
            onClick={!acctName ? handleAcctValidation : handleAddPrimaryAcct}
            value={!acctName ? 'Validate Account' : 'Add Primary Account'}
            height={50}
            isDisabled={!acctNumber}
            isLoading={!acctName ? loadAcctName : addPrimaryAcctLoading}
          />
        </View>
      </View>
    </WithModal>
  );
};

export default AddPrimaryAcctScreen;
