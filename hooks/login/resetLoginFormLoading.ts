import { useIndividualAuthLoginStore } from "#store/auth/login/IndividualAuthLoginStore";
import { useArtistAuthLoginStore } from "#store/auth/login/ArtistAuthLoginStore";
import { useGalleryAuthLoginStore } from "#store/auth/login/GalleryAuthLoginStore";

/** Clears loading on all role login forms (Zustand). Safe after screen unmount. */
export function resetAllLoginFormLoading() {
  useIndividualAuthLoginStore.getState().setIsLoading(false);
  useArtistAuthLoginStore.getState().setIsLoading(false);
  useGalleryAuthLoginStore.getState().setIsLoading(false);
}
