import { create } from "zustand";

type subscriptionStepperStoreTypes = {
  avs_input_fields: string[];
  updateAvsFields: (fields: string[]) => void;
  flw_charge_payload: FLWDirectChargeDataTypes & { name: string };
  update_flw_charge_payload_data: (
    data: FLWDirectChargeDataTypes & { name: string }
  ) => void;
  flw_ref: string;
  set_flw_ref: (ref: string) => void;
  webViewUrl: string | null;
  setWebViewUrl: (url: string | null) => void,
  transaction_id: string,
  set_transaction_id: (id: string) => void,
  reset: () => void
};

export const subscriptionStepperStore = create<subscriptionStepperStoreTypes>((set, get) => ({
  avs_input_fields: [],
  updateAvsFields: (fields: string[]) => {
    set({ avs_input_fields: fields });
  },
  // authorization: {} as AuthorizationData,
  // updateAuthorizationData: (data: AuthorizationData) => {
  //   set({ authorization: data });
  // },
  flw_charge_payload: {} as FLWDirectChargeDataTypes & { name: string },
  update_flw_charge_payload_data: (
    data: FLWDirectChargeDataTypes & { name: string }
  ) => {
    set({ flw_charge_payload: data });
  },
  flw_ref: "",
  set_flw_ref: (ref: string) => {
    set({ flw_ref: ref });
  },
  webViewUrl: null,
  setWebViewUrl: (url: string | null) => {
    set({webViewUrl: url})
  },
  transaction_id: '',
  set_transaction_id: (id: string) => {
    set({transaction_id: id})
  },
  reset: () => {
    set({
      avs_input_fields: [],
      flw_ref: "",
      webViewUrl: null,
      transaction_id: ''
    })
  }
}));
