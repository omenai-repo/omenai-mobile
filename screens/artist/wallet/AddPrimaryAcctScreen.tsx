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

const COUNTRIES_WITH_BANK_BRANCHES = [
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
];

const AFRICAN_COUNTRIES = [
  "NG",
  "GH",
  "KE",
  "UG",
  "ZA",
  "TZ",
  "RW",
  "CM",
  "CI",
  "SN",
  "BJ",
  "TD",
  "CG",
  "GA",
  "MW",
  "SL",
  "EG",
  "MA",
  "US",
] as const;

const SEPA_COUNTRY_CODES = [
  "AD",
  "AT",
  "BE",
  "BG",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LT",
  "LU",
  "LV",
  "MC",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
  "SM",
  "VA",
] as const;

type WalletRegion = "africa" | "uk" | "eu";

const resolveWalletRegion = (countryCode?: string): WalletRegion => {
  const code = countryCode?.toUpperCase() || "";
  if (code === "US") return "africa";
  if (code === "GB") return "uk";
  if (SEPA_COUNTRY_CODES.includes(code as (typeof SEPA_COUNTRY_CODES)[number])) {
    return "eu";
  }
  if (AFRICAN_COUNTRIES.includes(code as (typeof AFRICAN_COUNTRIES)[number])) {
    return "africa";
  }
  return "eu";
};

const isValidUKBankDetails = (accountNumber: string, sortCode: string): boolean => {
  const cleanSortCode = sortCode.replace(/[\s-]/g, "");
  const cleanAccountNumber = accountNumber.replace(/\s/g, "");
  return /^[0-9]{6}$/.test(cleanSortCode) && /^[0-9]{8}$/.test(cleanAccountNumber);
};

const isValidIBAN = (iban: string): boolean => {
  const cleanIban = iban.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/.test(cleanIban)) return false;
  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  const numericString = rearranged
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return (code - 55).toString();
      return char;
    })
    .join("");
  let checksum = numericString.slice(0, 2);
  for (let offset = 2; offset < numericString.length; offset += 7) {
    const slice = checksum + numericString.substring(offset, offset + 7);
    checksum = (parseInt(slice, 10) % 97).toString();
  }
  return parseInt(checksum, 10) === 1;
};

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
  const [manualBankName, setManualBankName] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [iban, setIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  const isEditing = !!walletData?.primary_withdrawal_account;
  const regionType = resolveWalletRegion(userSession?.address?.countryCode);
  const showBranches =
    regionType === "africa" &&
    !!selectedBank &&
    COUNTRIES_WITH_BANK_BRANCHES.includes(userSession.address.countryCode);

  const animation = useRef(null);
  const prevAcctNumberRef = useRef("");

  useEffect(() => {
    if (regionType !== "africa") return;
    if (acctNumber !== prevAcctNumberRef.current) {
      if (acctName) setAcctName("");
      setIsValidated(false);
      prevAcctNumberRef.current = acctNumber;
    }
  }, [acctNumber, acctName, regionType]);

  const fetchBankList = async () => {
    setFetchingBanks(true);
    try {
      const response = await fetchBanks(userSession.address.countryCode);
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
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      setFilteredBankList(bankList);
      return;
    }

    if (trimmedText.length < 3) {
      setFilteredBankList(bankList);
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
        COUNTRIES_WITH_BANK_BRANCHES.includes(userSession.address.countryCode) &&
        regionType === "africa"
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
  }, [selectedBank, userSession.address.countryCode, regionType]);

  const handleBranchSearch = (text: string) => {
    setBranchSearchText(text);
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      setFilteredBranchList(branchList);
      return;
    }
    if (trimmedText.length < 2) {
      setFilteredBranchList(branchList);
      return;
    }

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
    if (regionType !== "africa") {
      return;
    }
    if (!selectedBank) {
      updateModal({
        message: "Please select a bank",
        showModal: true,
        modalType: "error",
      });
      return;
    }
    if (showBranches && !selectedBranch) {
      updateModal({
        message: "Please select a bank branch",
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
    if (regionType === "uk") {
      if (!acctName || !manualBankName || !acctNumber || !sortCode) {
        updateModal({
          message: "Please fill all required UK account fields",
          showModal: true,
          modalType: "error",
        });
        return;
      }
      if (!isValidUKBankDetails(acctNumber, sortCode)) {
        updateModal({
          message: "Invalid UK account number or sort code",
          showModal: true,
          modalType: "error",
        });
        return;
      }
    }

    if (regionType === "eu") {
      if (!acctName || !manualBankName || !iban || !swiftCode) {
        updateModal({
          message: "Please fill all required account fields",
          showModal: true,
          modalType: "error",
        });
        return;
      }
      if (!isValidIBAN(iban)) {
        updateModal({
          message: "Invalid IBAN. Please check and try again.",
          showModal: true,
          modalType: "error",
        });
        return;
      }
    }

    if (regionType === "africa" && !isValidated) {
      updateModal({
        message: "Please validate your account before submitting",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    let account_details: any = null;

    if (regionType === "africa") {
      account_details = {
        type: "africa",
        account_number: acctNumber,
        bank_name: selectedBank?.label || "",
        account_name: acctName,
        bank_id: selectedBank?.id || "",
        bank_code: selectedBank?.value || "",
        branch: selectedBranch,
        bank_country: userSession.address.countryCode,
      };
    } else if (regionType === "uk") {
      account_details = {
        type: "uk",
        account_number: acctNumber,
        sort_code: sortCode.replace(/[\s-]/g, ""),
        bank_name: manualBankName,
        account_name: acctName,
        bank_country: userSession.address.countryCode,
      };
    } else {
      account_details = {
        type: "eu",
        iban: iban.replace(/\s/g, "").toUpperCase(),
        swift_code: swiftCode.trim().toUpperCase(),
        bank_name: manualBankName,
        account_name: acctName,
        bank_country: userSession.address.countryCode,
      };
    }

    const payload = {
      owner_id: userSession.id,
      account_details,
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

          {regionType === "africa" && (
            <>
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
                  setIsValidated(false);
                }}
                label="Bank Name"
                search={true}
                searchPlaceholder="Search bank"
                dropdownPosition="bottom"
                disable={isValidated}
              />

              {showBranches && (
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
                    setIsValidated(false);
                  }}
                  label="Bank Branch"
                  search={true}
                  searchPlaceholder="Search branch"
                  dropdownPosition="bottom"
                  disable={!selectedBank || isValidated}
                />
              )}

              <Input
                label={"Account number"}
                keyboardType="numeric"
                onInputChange={(text: string) => setAcctNumber(text)}
                placeHolder={`Enter acct number`}
                value={acctNumber}
                errorMessage={""}
                containerStyle={{ flex: 0 }}
                disabled={isValidated}
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
            </>
          )}

          {regionType === "uk" && (
            <>
              <Input
                label="Account Holder Name"
                onInputChange={(text: string) => setAcctName(text)}
                placeHolder="Enter account holder name"
                value={acctName}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
              <Input
                label="Bank Name"
                onInputChange={(text: string) => setManualBankName(text)}
                placeHolder="Enter bank name"
                value={manualBankName}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
              <Input
                label="Account Number"
                keyboardType="numeric"
                onInputChange={(text: string) => setAcctNumber(text)}
                placeHolder="8-digit account number"
                value={acctNumber}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
              <Input
                label="Sort Code"
                keyboardType="default"
                onInputChange={(text: string) => setSortCode(text)}
                placeHolder="123456 or 12-34-56"
                value={sortCode}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
            </>
          )}

          {regionType === "eu" && (
            <>
              <Input
                label="Account Holder Name"
                onInputChange={(text: string) => setAcctName(text)}
                placeHolder="Enter account holder name"
                value={acctName}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
              <Input
                label="Bank Name"
                onInputChange={(text: string) => setManualBankName(text)}
                placeHolder="Enter bank name"
                value={manualBankName}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
              <Input
                label="IBAN"
                onInputChange={(text: string) => setIban(text.toUpperCase())}
                placeHolder="Enter IBAN"
                value={iban}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
              <Input
                label="SWIFT / BIC"
                onInputChange={(text: string) =>
                  setSwiftCode(text.toUpperCase())
                }
                placeHolder="Enter SWIFT/BIC code"
                value={swiftCode}
                errorMessage=""
                containerStyle={{ flex: 0 }}
              />
            </>
          )}
        </View>

        <View style={tw`mt-[50px] mx-[20px]`}>
          {regionType === "africa" && isValidated ? (
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
          ) : regionType === "africa" ? (
            <FittedBlackButton
              onClick={handleStartFlow}
              value={"Validate Account"}
              isDisabled={
                !acctNumber || isValidating || !selectedBank || (showBranches && !selectedBranch)
              }
              isLoading={isValidating}
              style={{ height: 50 }}
            />
          ) : (
            <FittedBlackButton
              onClick={handleAddPrimaryAccount}
              value={isEditing ? "Update Primary Account" : "Add Primary Account"}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
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
