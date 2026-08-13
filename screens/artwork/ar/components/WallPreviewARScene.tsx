import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ViroARScene,
  ViroFlexView,
  ViroImage,
  ViroNode,
} from "@reactvision/react-viro";

import type { ArtworkDimensions, FrameStyle } from "#types/ar";
import { getImageFileView } from "#lib/storage/getImageFileView";

const SCALE_MIN = 0.5;
const SCALE_MAX = 2.2;
const FOLLOW_DISTANCE = 1.2;
const FOLLOW_VERTICAL_OFFSET = -0.05;
const BASE_WIDTH = 0.9;

type CameraTransform = {
  cameraTransform: {
    position: number[];
    forward: number[];
  };
};

type WallPreviewARSceneProps = {
  artworkUri: string;
  artworkDimensions: ArtworkDimensions;
  imageAspectRatio?: number;
  frameStyle?: FrameStyle;
  onPlaneDetected?: () => void;
  onPlacement?: () => void;
};

export default function WallPreviewARScene(props: any) {
  const viroAppProps =
    props.sceneNavigator?.viroAppProps ||
    props.arSceneNavigator?.viroAppProps ||
    props;
  const { artworkUri, artworkDimensions, imageAspectRatio, onPlacement } =
    viroAppProps as WallPreviewARSceneProps;

  const nodeRef = useRef<ViroNode>(null);
  const [scale, setScale] = useState(1);
  const pinchBaseScale = useRef(1);

  const aspectRatio = useMemo(() => {
    if (imageAspectRatio && imageAspectRatio > 0) {
      return imageAspectRatio;
    }
    if (artworkDimensions.width <= 0 || artworkDimensions.height <= 0) return 1;
    return artworkDimensions.width / artworkDimensions.height;
  }, [artworkDimensions.height, artworkDimensions.width, imageAspectRatio]);

  const imageWidth = BASE_WIDTH * scale;
  const imageHeight = imageWidth / aspectRatio;

  const onCameraTransformUpdate = useCallback((transform: CameraTransform) => {
    const { position, forward } = transform.cameraTransform;
    const nextPosition: [number, number, number] = [
      position[0] + forward[0] * FOLLOW_DISTANCE,
      position[1] + forward[1] * FOLLOW_DISTANCE + FOLLOW_VERTICAL_OFFSET,
      position[2] + forward[2] * FOLLOW_DISTANCE,
    ];

    nodeRef.current?.setNativeProps({
      position: nextPosition,
      // Add 180 degrees so the front of the image faces the camera
      rotation: [
        0,
        (Math.atan2(forward[0], forward[2]) * 180) / Math.PI + 180,
        0,
      ],
    });
  }, []);

  const onPinch = useCallback(
    (pinchState: number, scaleFactor: number) => {
      if (pinchState === 1) {
        pinchBaseScale.current = scale;
        return;
      }

      if (pinchState === 2) {
        const nextScale = Math.min(
          SCALE_MAX,
          Math.max(SCALE_MIN, pinchBaseScale.current * scaleFactor),
        );
        setScale(nextScale);
        return;
      }

      if (pinchState === 3) {
        pinchBaseScale.current = scale;
      }
    },
    [scale],
  );

  const onDrag = useCallback(() => {
    onPlacement?.();
  }, [onPlacement]);

  return (
    <ViroARScene onCameraTransformUpdate={onCameraTransformUpdate}>
      <ViroNode ref={nodeRef} position={[0, 0, -FOLLOW_DISTANCE]}>
        <ViroFlexView
          width={imageWidth}
          height={imageHeight}
          onPinch={onPinch}
          onDrag={onDrag}
        >
          <ViroImage
            source={{
              uri: getImageFileView(artworkUri, 500).toString() + "&ext=.jpg",
            }}
            width={imageWidth}
            height={imageHeight}
            resizeMode="ScaleToFill"
            onError={(e) =>
              console.log("ViroImage Error:", e.nativeEvent.error)
            }
          />
        </ViroFlexView>
      </ViroNode>
    </ViroARScene>
  );
}
