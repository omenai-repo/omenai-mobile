interface Dimensions {
  width: number;
  height: number;
}

export function resizeImageDimensions(
  dimensions: Dimensions,
  maxWidth: number,
  maxHeight: number,
): Dimensions {
  const { width, height } = dimensions;
  const aspectRatio = width / height;

  let newWidth = maxWidth;
  let newHeight = newWidth / aspectRatio;

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) };
}
