import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useRoute } from "@react-navigation/native";
import EditPricing from "./components/EditPricing";
import DeleteArtworkButton from "#screens/artwork/detail/components/DeleteArtworkButton";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { useAppStore } from "#store/app/appStore";

export default function EditArtwork() {
  const route = useRoute();
  const { userType } = useAppStore();
  const [artID, setArtID] = useState<string | null>(null);

  useEffect(() => {
    const { art_id } = route.params as { art_id: string };
    setArtID(art_id);
  }, []);

  return (
    <>
      <BackHeaderTitle
        title={userType === "gallery" ? "Edit artwork pricing" : ""}
      />
      <ScrollWrapper style={styles.container}>
        {userType === "gallery" && artID && <EditPricing art_id={artID} />}
        {artID && <DeleteArtworkButton art_id={artID} />}
      </ScrollWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 10,
  },
});
