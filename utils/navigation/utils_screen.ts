import { Dimensions } from "react-native";


export const getNumberOfColumns = () => {
    const { width } = Dimensions.get('window');
    return width >= 768 ? 3 : 2; // Adjust for tablets (width >= 768)
};