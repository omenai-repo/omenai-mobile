interface Dimensions {
    width: number;
    height: number;
}
  
export function resizeImageDimensions(dimensions: Dimensions, heightLimit: number): Dimensions {
    const { width, height } = dimensions;

    // If the height is within the limit, return the original dimensions
    if (height <= heightLimit) {
        return { width, height };
    }

    // Calculate the aspect ratio
    const aspectRatio = width / height;

    // Calculate the new height and width while maintaining the aspect ratio
    const newHeight = heightLimit;
    const newWidth = Math.round(newHeight * aspectRatio);

    return { width: newWidth, height: newHeight };
}