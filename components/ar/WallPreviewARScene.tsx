import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ViroARScene,
  ViroFlexView,
  ViroImage,
  ViroNode,
} from "@reactvision/react-viro";

import type { ArtworkDimensions, FrameStyle } from "#components/ar/types";

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
  frameStyle?: FrameStyle;
  onPlaneDetected?: () => void;
  onPlacement?: () => void;
};

export default function WallPreviewARScene(
  props: WallPreviewARSceneProps,
) {
  const { artworkUri, artworkDimensions, onPlacement } = props;
  const nodeRef = useRef<ViroNode>(null);
  const [scale, setScale] = useState(1);
  const pinchBaseScale = useRef(1);

  const aspectRatio = useMemo(() => {
    if (artworkDimensions.width <= 0) return 1;
    return artworkDimensions.height / artworkDimensions.width;
  }, [artworkDimensions.height, artworkDimensions.width]);

  const imageWidth = BASE_WIDTH * scale;
  const imageHeight = imageWidth * aspectRatio;

  const onCameraTransformUpdate = useCallback((transform: CameraTransform) => {
    const { position, forward } = transform.cameraTransform;
    const nextPosition: [number, number, number] = [
      position[0] + forward[0] * FOLLOW_DISTANCE,
      position[1] + forward[1] * FOLLOW_DISTANCE + FOLLOW_VERTICAL_OFFSET,
      position[2] + forward[2] * FOLLOW_DISTANCE,
    ];

    nodeRef.current?.setNativeProps({
      position: nextPosition,
      rotation: [
        0,
        Math.atan2(forward[0], forward[2]) * (180 / Math.PI),
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
            source={{ uri: artworkUri }}
            width={imageWidth}
            height={imageHeight}
            resizeMode="ScaleToFill"
          />
        </ViroFlexView>
      </ViroNode>
    </ViroARScene>
  );
}
