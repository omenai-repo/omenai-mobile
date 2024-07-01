import { ordersColorsTypes } from "components/gallery/OrderCard";

export const getColors = (selectedTab : string): ordersColorsTypes => {
    if(selectedTab === 'processing'){
        return {bgColor: '#007BFF26', textColor: '#007BFF'}
    }
    if(selectedTab === 'completed'){
        return {bgColor: '#ff000026', textColor: '#ff0000'}
    }

    return {bgColor: '#FEF7EC', textColor: '#F3A218'}
};