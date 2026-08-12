export type FrameStyle = "dark" | "light";

export type ArtworkDimensions = {
  width: number;
  height: number;
};

export type ARRoomPreviewProps = {
  /** Remote artwork image URL — always the listing image, never from the user's gallery */
  artworkUri: string;
  artworkTitle: string;
  artworkDimensions: ArtworkDimensions;
  frameStyle?: FrameStyle;
  onClose: () => void;
};
