import React from "react";
import { View } from "react-native";
import type { GalleryEventRecord } from "#services/marketplace/events/events.service";
import FairEventHero from "#screens/marketplace/discovery/fairsEvents/components/FairEventHero";
import FairEventInfo from "#screens/marketplace/discovery/fairsEvents/components/FairEventInfo";
import FairEventWorksSection from "#screens/marketplace/discovery/fairsEvents/components/FairEventWorksSection";

type Props = {
  readonly event: GalleryEventRecord;
};

/**
 * Shared body for gallery programs (exhibition shows) and art fairs / events.
 * Data shape is the same; hook + route differ per surface.
 */
export default function ProgramDetailsContent({ event }: Readonly<Props>) {
  return (
    <View>
      <FairEventHero event={event} />
      <FairEventInfo event={event} />
      <FairEventWorksSection event={event} />
    </View>
  );
}
