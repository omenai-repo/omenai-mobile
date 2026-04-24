import React from "react";
import { View } from "react-native";
import type { GalleryEventRecord } from "#services/events/events.service";
import FairEventHero from "#screens/individual/fairsEvents/components/FairEventHero";
import FairEventInfo from "#screens/individual/fairsEvents/components/FairEventInfo";
import FairEventWorksSection from "#screens/individual/fairsEvents/components/FairEventWorksSection";

type Props = {
  event: GalleryEventRecord;
};

/**
 * Shared body for gallery programs (exhibition shows) and art fairs / events.
 * Data shape is the same; hook + route differ per surface.
 */
export default function ProgramDetailsContent({ event }: Props) {
  return (
    <View>
      <FairEventHero event={event} />
      <FairEventInfo event={event} />
      <FairEventWorksSection event={event} />
    </View>
  );
}
