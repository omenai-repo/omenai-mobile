import { View, TextInput, Modal, ScrollView, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import Input from "#components/inputs/Input";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import tw from "twrnc";
import { fetchBanks } from "#services/wallet/fetchBanks";
import { debounce } from "lodash";
import { useAppStore } from "#store/app/appStore";
import { validateBankAcct } from "#services/wallet/validateBankAct";
import { useModalStore } from "#store/modal/modalStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchBankBranches } from "#services/wallet/fetchBankBranches";

import LottieView from "lottie-react-native";
import loaderAnimation from "../../../assets/other/loader-animation.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WALLET_QK } from "#utils/queryKeys";
import { addPrimaryAcct } from "#services/wallet/addPrimaryAcct";

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
  "BJ",
  "CM",
  "TD",
  "CI",
  "CG",
  "GA",
  "GH",
  "MW",
  "RW",
  "SN",
  "SL",
  "TZ",
  "UG",
  // 'NG',
];

const TXNS_QK = ["wallet", "artist", "txns", { status: "all" }] as const;
const BASE_TXNS_QK = ["wallet", "artist", "txns"] as const;

const AddPrimaryAcctScreen = () => {
  const { walletData } = useRoute().params as { walletData: any };
  const { userSession } = useAppStore();
  const { updateModal, clear } = useModalStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();

  const [fetchingBanks, setFetchingBanks] = useState(false);
  const [bankList, setBankList] = useState<BankOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [filteredBankList, setFilteredBankList] = useState<BankOption[]>([]);
  const [searchText, setSearchText] = useState("");
  const [branchSearchText, setBranchSearchText] = useState("");
  const [branchList, setBranchList] = useState<BankOption[]>([]);
  const [filteredBranchList, setFilteredBranchList] = useState<BankOption[]>(
    [],
  );
  const [selectedBranch, setSelectedBranch] = useState<BankOption | null>(null);
  const [acctNumber, setAcctNumber] = useState("");
  const [acctName, setAcctName] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  const isEditing = !!walletData?.primary_withdrawal_account;

  const animation = useRef(null);
  const prevAcctNumberRef = useRef("");

  useEffect(() => {
    if (acctNumber !== prevAcctNumberRef.current) {
      // Clear acct name only if there was a previously validated name
      if (acctName) setAcctName("");
      setIsValidated(false);
      // Update the previous value
      prevAcctNumberRef.current = acctNumber;
    }
  }, [acctNumber, acctName]);

  const fetchBankList = async () => {
    setFetchingBanks(true);
    try {
      const response = await fetchBanks();
      if (response?.isOk && Array.isArray(response?.data.banks)) {
        const formattedData: BankOption[] = response.data.banks
          .map((bank: Bank & { id: string }): BankOption & { id: string } => ({
            label: bank.name,
            value: bank.code,
            id: bank.id,
          }))
          .sort((a: BankOption, b: BankOption) =>
            a.label.localeCompare(b.label),
          );

        setBankList(formattedData);
        setFilteredBankList(formattedData); // Initialize filtered list
      }
    } catch (error) {
      console.error("Fetch bank error:", error);
    } finally {
      setFetchingBanks(false);
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
      if (
        selectedBank?.value &&
        supportedCountryCodes.includes(userSession.address.countryCode)
      ) {
        try {
          setFetchingBanks(true);
          const response = await fetchBankBranches(selectedBank.id ?? "");
          if (response?.isOk && Array.isArray(response?.data)) {
            const formatted = response.data
              .map((branch: any) => ({
                label: branch.branch_name,
                value: branch.branch_code,
                id: branch.id,
              }))
              .sort((a: BankOption, b: BankOption) =>
                a.label.localeCompare(b.label),
              );

            setBranchList(formatted);
            setFilteredBranchList(formatted);
          }
          setFetchingBanks(false);
        } catch (error) {
          console.error("Error fetching branches:", error);
          setFetchingBanks(false);
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
    setFilteredBranchList(filtered);
  };

  const handleBranchSearchDebounced = useCallback(
    debounce(handleBranchSearch, 300),
    [branchList],
  );

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [bankList]);

  const { isFetching: isValidating, refetch: validateAcct } = useQuery({
    queryKey: WALLET_QK.validate(selectedBank?.value || "", acctNumber),
    queryFn: () => validateBankAcct(selectedBank!.value, acctNumber),
    enabled: false,
    retry: false,
  });

  const { mutate: submitPrimaryAcct, isPending: isSubmitting } = useMutation({
    mutationFn: addPrimaryAcct,
    onSuccess: (response: any) => {
      const successMessage = isEditing
        ? "Primary account updated successfully"
        : "Primary account added successfully";

      if (response?.isOk) {
        clear();
        updateModal({
          message: successMessage,
          showModal: true,
          modalType: "success",
        });
        queryClient.invalidateQueries({ queryKey: WALLET_QK.artist });
        queryClient.invalidateQueries({ queryKey: TXNS_QK });
        queryClient.invalidateQueries({ queryKey: BASE_TXNS_QK });
        navigation.goBack();
      } else {
        updateModal({
          message: response?.data?.message || "Error saving primary account",
          showModal: true,
          modalType: "error",
        });
      }
    },
    onError: (error: any) => {
      console.log(error);
      updateModal({
        message: error.message || "An unexpected error occurred",
        showModal: true,
        modalType: "error",
      });
    },
  });

  const handleStartFlow = async () => {
    if (!selectedBank) {
      updateModal({
        message: "Please select a bank",
        showModal: true,
        modalType: "error",
      });
      return;
    }
    if (!acctNumber) {
      updateModal({
        message: "Please enter account number",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    const { data: response } = await validateAcct();

    if (response?.isOk) {
      setAcctName(response.data.account_name);
      setIsValidated(true);
    } else {
      setIsValidated(false);
      updateModal({
        message:
          response?.data?.message || "Invalid account number or bank code",
        showModal: true,
        modalType: "error",
      });
    }
  };

  const handleAddPrimaryAccount = () => {
    // Match Web Payload Structure exactly
    const payload = {
      owner_id: userSession.id,
      account_details: {
        account_number: acctNumber,
        bank_name: selectedBank?.label || "",
        account_name: acctName,
        bank_id: selectedBank?.id || "",
        bank_code: selectedBank?.value || "",
        branch: selectedBranch, // Passing whatever we have (string or object structure if changed upstream)
        bank_country: userSession.address.countryCode,
      },
      base_currency: userSession.base_currency,
    };

    submitPrimaryAcct(payload);
  };

  return (
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
            value={userSession?.address?.country || "Select country"}
            handleSetValue={() => {}}
            label="Country"
            disable={true}
          />

          <CustomSelectPicker
            data={filteredBankList}
            placeholder="Select bank name"
            value={selectedBank?.value || ""}
            renderInputSearch={() => (
              <TextInput
                placeholder="Search bank"
                value={searchText}
                style={{
                  padding: 15,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#fff",
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
              setBranchSearchText("");
              setIsValidated(false); // Reset validation on bank change
            }}
            label="Bank Name"
            search={true}
            searchPlaceholder="Search bank"
            dropdownPosition="bottom"
            disable={isValidated}
          />

          {supportedCountryCodes.includes(userSession.address.countryCode) && (
            <CustomSelectPicker
              data={filteredBranchList}
              placeholder="Select bank branch"
              value={selectedBranch?.value || ""}
              renderInputSearch={() => (
                <TextInput
                  placeholder="Search branch"
                  value={branchSearchText}
                  style={{
                    padding: 15,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: "#fff",
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
                setIsValidated(false); // Reset validation on branch change
              }}
              label="Bank Branch"
              search={true}
              searchPlaceholder="Search branch"
              dropdownPosition="bottom"
              disable={!selectedBank || isValidated}
            />
          )}

          <Input
            label={"Account number"} // Capitalize label
            keyboardType="numeric"
            onInputChange={(text: string) => setAcctNumber(text)}
            placeHolder={`Enter acct number`}
            value={acctNumber}
            errorMessage={""}
            containerStyle={{ flex: 0 }}
            disabled={isValidated} // Disable when validated to match web
          />

          <View>
            <Input
              label="Account Name"
              disabled={true}
              onInputChange={() => {}}
              placeHolder="Account Name"
              value={acctName}
              containerStyle={{ flex: 0, opacity: 0.7 }}
            />
            <Text style={tw`text-[10px] text-gray-500 mt-1 ml-1`}>
              * Account name is automatically fetched and cannot be edited.
            </Text>
          </View>
        </View>

        <View style={tw`mt-[50px] mx-[20px]`}>
          {isValidated ? (
            <View style={tw`gap-2`}>
              <FittedBlackButton
                onClick={handleAddPrimaryAccount}
                value={
                  isEditing ? "Update Primary Account" : "Add Primary Account"
                }
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                style={{ height: 50 }}
              />

              {/* Optional: Add a button to reset validation if they need to change details */}
              <FittedBlackButton
                onClick={() => setIsValidated(false)}
                value={"Change Details"}
                isDisabled={isSubmitting}
                isLoading={false}
                style={{
                  height: 50,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
                textStyle={{ color: "#666" }}
              />
            </View>
          ) : (
            <FittedBlackButton
              onClick={handleStartFlow}
              value={"Validate Account"}
              isDisabled={!acctNumber || isValidating || !selectedBank}
              isLoading={isValidating}
              style={{ height: 50 }}
            />
          )}
        </View>
      </View>
      <Modal visible={fetchingBanks} transparent animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-white`}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 120,
              height: 120,
            }}
            source={loaderAnimation}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddPrimaryAcctScreen;
