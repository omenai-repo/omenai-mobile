import { ordersColorsTypes } from "components/gallery/OrderCard";

export const getColors = (selectedTab : string): ordersColorsTypes => {
    if(selectedTab === 'processing'){
        return {bgColor: '#3E272360', textColor: '#3E2723'}
    }
    if(selectedTab === 'completed'){
        return {bgColor: '#32a85620', textColor: '#1f9c44'}
    }

    return {bgColor: '#FEF7EC', textColor: '#F3A218'}
};