import { View, Text, TextInput, Modal, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/other/loader-animation.json';

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

  const isEditing = !!walletData?.primary_withdrawal_account;

  useEffect(() => {
    if (isEditing) {
      const account = walletData.primary_withdrawal_account;

      setAcctName(account.account_name);
      setAcctNumber(account.account_number);
      setSelectedBank({
        label: account.bank_name,
        value: account.bank_code,
        id: String(account.bank_id),
      });
      setSelectedBranch({
        label: account.bank_branch,
        value: account.bank_branch,
      });
    }
  }, [walletData]);

  const animation = useRef(null);
  const prevAcctNumberRef = useRef('');

  useEffect(() => {
    if (acctNumber !== prevAcctNumberRef.current) {
      // Clear acct name only if there was a previously validated name
      if (acctName) setAcctName('');
      // Update the previous value
      prevAcctNumberRef.current = acctNumber;
    }
  }, [acctNumber]);

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
          setIsLoading(true);
          const response = await fetchBankBranches(selectedBank.id ?? '');
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
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching branches:', error);
          setIsLoading(false);
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
    if (!acctName) {
      updateModal({
        message: 'Please validate account number first',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    setAddPrimaryAcctLoading(true);

    const payload = {
      owner_id: userSession.id,
      account_details: {
        bank_code: selectedBank?.value || '',
        account_number: acctNumber,
        account_name: acctName,
        bank_branch: selectedBranch?.value || '',
        bank_country: userSession.address.countryCode,
        bank_name: selectedBank?.label || '',
        bank_id: selectedBank?.id || '',
      },
      base_currency: userSession.base_currency,
    };

    const response = await addPrimaryAcct(payload);

    const successMessage = isEditing
      ? 'Primary account updated successfully'
      : 'Primary account added successfully';

    if (response?.isOk) {
      updateModal({
        message: successMessage,
        showModal: true,
        modalType: 'success',
      });
      navigation.goBack();
    } else {
      updateModal({
        message: 'Error saving primary account',
        showModal: true,
        modalType: 'error',
      });
    }

    setAddPrimaryAcctLoading(false);
  };

  return (
    <WithModal>
      <ScrollView
        contentContainerStyle={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        style={tw`bg-[#F7F7F7]`}
      >
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
                setSelectedBranch(null);
                setBranchList([]);
                setFilteredBranchList([]);
                setBranchSearchText('');
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
                      handleBranchSearchDebounced(text);
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
              value={
                !acctName
                  ? 'Validate Account'
                  : isEditing
                  ? 'Update Primary Account'
                  : 'Add Primary Account'
              }
              height={50}
              isDisabled={!acctNumber}
              isLoading={!acctName ? loadAcctName : addPrimaryAcctLoading}
            />
          </View>
        </View>
        <Modal visible={isLoading} transparent animationType="fade">
          <View style={tw.style('flex-1 justify-center items-center bg-black bg-opacity-50')}>
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 250,
                height: 250,
              }}
              source={loaderAnimation}
            />
          </View>
        </Modal>
      </ScrollView>
    </WithModal>
  );
};

export default AddPrimaryAcctScreen;
