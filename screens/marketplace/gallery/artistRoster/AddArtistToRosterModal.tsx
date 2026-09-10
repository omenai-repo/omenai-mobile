import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQueryClient } from "@tanstack/react-query";
import tw from "twrnc";

import BackScreenButton from "#components/buttons/BackScreenButton";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { AddArtistSearchSuggestions } from "#components/gallery/artistRoster/AddArtistSearchSuggestions";
import { AddArtistSuccessView } from "#components/gallery/artistRoster/AddArtistSuccessView";
import { AddArtistTombstoneFields } from "#components/gallery/artistRoster/AddArtistTombstoneFields";
import { colors } from "#config/colors.config";
import { artist_countries_codes_currency } from "#data/artist_countries_codes_currency";
import {
  addArtistToRoster,
  searchArtistsForRoster,
} from "#services/marketplace/roster/galleryRoster";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/account/modal/modalStore";
import type { ArtistSearchResult } from "#types/roster.types";
import {
  isValidRosterBirthYear,
  rosterBirthYearValidationMessage,
} from "#utils/core/rosterBirthYear";

const ROSTER_QK = (galleryId: string) => ["gallery-roster", galleryId] as const;

export default function AddArtistToRosterModal() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const galleryId =
    route.params?.galleryId ?? (userSession?.id as string | undefined) ?? "";

  const [view, setView] = useState<"form" | "success">("form");
  const [query, setQuery] = useState("");
  const [artistId, setArtistId] = useState("");
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [country_of_origin, setCountry_of_origin] = useState("");
  const [profileCityOrLocation, setProfileCityOrLocation] = useState("");
  const [successLogo, setSuccessLogo] = useState<string | null>(null);

  const [results, setResults] = useState<ArtistSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosingSuccess, setIsClosingSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const queryRef = useRef("");
  const artistIdRef = useRef("");
  const nameRef = useRef("");
  useEffect(() => {
    queryRef.current = query;
  }, [query]);
  useEffect(() => {
    artistIdRef.current = artistId;
  }, [artistId]);
  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  const resetForm = useCallback(() => {
    setView("form");
    setQuery("");
    setArtistId("");
    setName("");
    setBirthyear("");
    setCountry_of_origin("");
    setProfileCityOrLocation("");
    setSuccessLogo(null);
    setResults([]);
    setIsSearching(false);
    setIsSubmitting(false);
    setIsClosingSuccess(false);
    setShowSuggestions(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm]),
  );

  const countryOptions = useMemo(
    () =>
      [...artist_countries_codes_currency]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ label: c.name, value: c.name })),
    [],
  );

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    if (artistId && q === name) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const t = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchArtistsForRoster(q);
      setIsSearching(false);
      if (res.isOk) setResults(res.results);
      else setResults([]);
    }, 300);

    return () => clearTimeout(t);
  }, [query, artistId, name]);

  const dismissModalSheet = useCallback(() => {
    const nav = navigation as StackNavigationProp<any>;
    if (nav.canGoBack()) {
      nav.goBack();
      return;
    }
    const parent = nav.getParent?.();
    if (parent?.canGoBack?.()) {
      parent.goBack();
      return;
    }
    nav.dispatch(StackActions.pop(1));
  }, [navigation]);

  const handleClose = useCallback(() => {
    dismissModalSheet();
  }, [dismissModalSheet]);

  const leaveModalAfterSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ROSTER_QK(galleryId) });
    dismissModalSheet();
  }, [dismissModalSheet, queryClient, galleryId]);

  const handleSelectArtist = (selected: ArtistSearchResult) => {
    setQuery(selected.name);
    setName(selected.name);
    setArtistId(selected.artist_id);
    setBirthyear(selected.birthyear || "");
    setCountry_of_origin(selected.country_of_origin || "");
    setProfileCityOrLocation(selected.location?.trim() || "");
    setSuccessLogo(selected.logo || null);
    setResults([]);
    setShowSuggestions(false);
  };

  const handleCreateNew = () => {
    const n = query.trim();
    setArtistId("");
    setName(n);
    setBirthyear("");
    setCountry_of_origin("");
    setProfileCityOrLocation("");
    setSuccessLogo(null);
    setResults([]);
    setShowSuggestions(false);
  };

  const commitTypedNameAsNewGhost = useCallback(() => {
    const q = queryRef.current.trim();
    if (!q || artistIdRef.current) return;
    if (nameRef.current === q) {
      setShowSuggestions(false);
      return;
    }
    setName(q);
    setBirthyear("");
    setCountry_of_origin("");
    setProfileCityOrLocation("");
    setSuccessLogo(null);
    setShowSuggestions(false);
  }, []);

  const onQueryChange = (text: string) => {
    setQuery(text);
    setShowSuggestions(true);
    if (artistId && text !== name) {
      setArtistId("");
      setBirthyear("");
      setCountry_of_origin("");
      setProfileCityOrLocation("");
      setName("");
      setSuccessLogo(null);
    } else if (!artistId && name && text.trim() !== name.trim()) {
      setName("");
      setBirthyear("");
      setCountry_of_origin("");
      setProfileCityOrLocation("");
    }
  };

  const ghostLabel = useMemo(() => name.trim() || query.trim(), [name, query]);
  const isGhost = !artistId && !!ghostLabel;
  const showTombstoneFields =
    Boolean(name.trim()) || (!artistId && query.trim().length >= 2);
  const birthyearTrimmed = birthyear.trim();
  const countryTrimmed = country_of_origin.trim();
  const ghostBirthYearInvalid =
    birthyearTrimmed.length > 0 &&
    !isValidRosterBirthYear(birthyearTrimmed);
  const isMissingGhostData =
    isGhost &&
    (!isValidRosterBirthYear(birthyearTrimmed) || !countryTrimmed);
  const isButtonDisabled =
    !galleryId ||
    (!artistId && !ghostLabel) ||
    isMissingGhostData ||
    isSubmitting;

  const handleConfirmAdd = async () => {
    if (!galleryId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Missing gallery. Please sign in again and retry.",
      });
      return;
    }
    if (
      !artistId &&
      ghostLabel &&
      !isValidRosterBirthYear(birthyear.trim())
    ) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: rosterBirthYearValidationMessage(),
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = artistId
        ? await addArtistToRoster({ gallery_id: galleryId, artist_id: artistId })
        : await addArtistToRoster({
          gallery_id: galleryId,
          newGhostData: {
            name: ghostLabel,
            birthyear: birthyear.trim(),
            country_of_origin: country_of_origin.trim(),
          },
        });

      if (res.isOk) {
        setView("success");
      } else {
        updateModal({
          showModal: true,
          modalType: "error",
          message: res.message || "Could not add artist. Please try again.",
        });
      }
    } catch (error: any) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: error?.message || error?.body?.message || "Could not add artist. An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessDone = async () => {
    if (isClosingSuccess) return;
    setIsClosingSuccess(true);
    try {
      await leaveModalAfterSuccess();
    } finally {
      setIsClosingSuccess(false);
    }
  };

  const displayName = name.trim() || query.trim();
  const trimmedQuery = query.trim();
  const isDraftingSuggestion =
    showSuggestions &&
    trimmedQuery.length >= 1 &&
    (!artistId || query !== name);

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[tw`flex-row items-center px-4 border-b border-neutral-100 pt-5`]}>
        <BackScreenButton handleClick={handleClose} cancle color={colors.grey} />
        <Text style={[tw`text-lg font-medium flex-1 text-center pr-10`, { color: colors.black }]}>
          Add to Roster
        </Text>
      </View>

      {view === "form" ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={tw`px-5 pb-10 pt-6`}
          showsVerticalScrollIndicator={false}
        >
          <AddArtistSearchSuggestions
            galleryId={galleryId}
            query={query}
            onQueryChange={onQueryChange}
            onFocusSearch={() => setShowSuggestions(true)}
            trimmedQuery={trimmedQuery}
            isDraftingSuggestion={isDraftingSuggestion}
            isSearching={isSearching}
            results={results}
            artistId={artistId}
            onSelectArtist={handleSelectArtist}
            onCreateNew={handleCreateNew}
            onCommitTypedAsNewGhost={commitTypedNameAsNewGhost}
          />

          <AddArtistTombstoneFields
            show={showTombstoneFields}
            artistId={artistId}
            profileCityOrLocation={profileCityOrLocation}
            onProfileCityOrLocationChange={setProfileCityOrLocation}
            birthyear={birthyear}
            onBirthyearChange={setBirthyear}
            onBirthyearFocus={commitTypedNameAsNewGhost}
            birthYearError={
              ghostBirthYearInvalid ? rosterBirthYearValidationMessage() : null
            }
            country_of_origin={country_of_origin}
            countryOptions={countryOptions}
            onCountryChange={setCountry_of_origin}
          />

          <View style={tw`mt-10`}>
            <LongBlackButton
              value={isSubmitting ? "Adding…" : "Confirm & Add"}
              onClick={handleConfirmAdd}
              isDisabled={isButtonDisabled}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      ) : (
        <AddArtistSuccessView
          displayName={displayName}
          successLogo={successLogo}
          onDone={handleSuccessDone}
          isDoneLoading={isClosingSuccess}
        />
      )}
    </KeyboardAvoidingView>
  );
}
