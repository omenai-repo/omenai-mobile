import { useWindowDimensions } from "react-native";

// Custom hook to handle device-specific breakpoints and sizing.
export const useDevice = () => {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const isMobile = !isTablet;

  return {
    width,
    height,
    isTablet,
    isDesktop,
    isMobile,
    numColumns: isTablet ? 3 : 2,
    horizontalPadding: isTablet ? 40 : 20,
  };
};
