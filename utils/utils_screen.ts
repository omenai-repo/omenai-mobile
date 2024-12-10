import { Dimensions } from "react-native";


export const getNumberOfColumns = () => {
    const { width } = Dimensions.get('window');
    return width >= 768 ? 4 : 2; // Adjust for tablets (width >= 768)
};