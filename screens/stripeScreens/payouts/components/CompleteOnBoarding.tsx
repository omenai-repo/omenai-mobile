import { Linking, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Input from "components/inputs/Input";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import LongBlackButton from "components/buttons/LongBlackButton";
import { getAccountID } from "services/stripe/getAccountID";
import { createAccountLink } from "services/stripe/createAccountLink";
import { useModalStore } from "store/modal/modalStore";
import tw from "twrnc";

export default function CompleteOnBoarding() {
  const [gallerySession, setGallerySession] = useState();
  const [accountID, setAccountID] = useState("");
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);

  const { updateModal } = useModalStore();

  useEffect(() => {
    //fetch gallery session
    async function handleFetchSession() {
      const session = await utils_getAsyncData("userSession");
      if (session.value) {
        setGallerySession(JSON.parse(session.value));
        const connect_id = await getAccountID(JSON.parse(session.value).id);
        if (connect_id?.data) {
          setAccountID(connect_id.data.connected_account_id);
        }
      }
      return;
    }

    handleFetchSession();
  }, []);

  async function handleCompleteOnboarding() {
    setAccountLinkCreatePending(true);
    const res = await createAccountLink(accountID!);

    if (res?.isOk) {
      const supportedLink = await Linking.canOpenURL(res.url);
      if (supportedLink) {
        setAccountLinkCreatePending(false);
        await Linking.openURL(res.url);
      }
    } else {
      updateModal({
        message: "Something went wrong, please try again or contact support",
        modalType: "error",
        showModal: true,
      });
    }
  }

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-col gap-5`}>
        <Input
          label="Full Name"
          placeHolder=""
          onInputChange={() => {}}
          value={gallerySession?.name || ""}
          disabled
        />
        <Input
          label="Email address"
          placeHolder=""
          onInputChange={() => {}}
          value={gallerySession?.email || ""}
          disabled
        />
        {accountID && <Text>Your connected account ID is: {accountID}</Text>}
      </View>
      <View style={{ marginTop: 30 }}>
        <LongBlackButton
          value="Complete onboarding"
          onClick={handleCompleteOnboarding}
          isDisabled={accountID.length < 1}
          isLoading={accountLinkCreatePending}
        />
      </View>
    </View>
  );
}
