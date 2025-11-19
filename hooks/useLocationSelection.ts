import { useCallback, useEffect, useRef } from "react";
import { State, City, IState, ICity } from "country-state-city";
import { debounce } from "lodash";

interface LocationState {
  countryCode: string;
  state: string;
}

interface LocationActions {
  setState: (value: string) => void;
  setStateCode?: (value: string) => void;
  setCity: (value: string) => void;
  setCountry: (value: string) => void;
  setCountryCode: (value: string) => void;
  setStateData: (data: any[]) => void;
  setCityData: (data: any[]) => void;
  setBaseCurrency?: (value: string) => void;
}

export const useLocationSelection = (locationState: LocationState, actions: LocationActions) => {
  const handleCountrySelect = (item: { label: string; value: string; currency?: string }) => {
    actions.setCountry(item.label);
    actions.setCountryCode(item.value);

    if (item.currency && actions.setBaseCurrency) {
      actions.setBaseCurrency(item.currency);
    }

    // Reset state and city selections
    actions.setState("");
    actions.setCity("");

    // Clear state and city dropdown data
    actions.setStateData([]);
    actions.setCityData([]);

    // Get the selected country's states
    const getStates = State.getStatesOfCountry(item.value);

    // Set the states dropdown data
    actions.setStateData(
      getStates
        ? getStates.map((state: IState) => ({
            label: state.name,
            value: state.name,
            isoCode: state.isoCode,
          }))
        : []
    );
  };

  const fetchCitiesRef = useRef(
    debounce((countryCode: string, stateCode: string, setCityData: (data: any[]) => void) => {
      const getCities = City.getCitiesOfState(countryCode, stateCode);
      setCityData(
        getCities?.map((city: ICity) => ({
          label: city.name,
          value: city.name,
        })) || []
      );
    }, 300)
  );

  useEffect(() => {
    const debouncedFn = fetchCitiesRef.current;
    return () => {
      debouncedFn.cancel();
    };
  }, []);

  const handleStateSelect = useCallback(
    (item: { label: string; value: string; isoCode?: string }) => {
      actions.setState(item.value);
      if (item.isoCode && actions.setStateCode) {
        actions.setStateCode(item.isoCode);
      }
      fetchCitiesRef.current(locationState.countryCode, item.isoCode || "", actions.setCityData);
    },
    [locationState.countryCode, actions]
  );

  return {
    handleCountrySelect,
    handleStateSelect,
  };
};
