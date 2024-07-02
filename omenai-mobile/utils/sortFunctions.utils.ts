import { ordersColorsTypes } from "components/gallery/OrderCard";

export const getColors = (selectedTab : string, order?: any): ordersColorsTypes => {
    if(selectedTab === 'processing' && order?.payment_information.status === "completed"){
        return {bgColor: '#3E272320', textColor: '#000'}
    }
    if(selectedTab === 'completed' &&  order?.order_accepted.status === "accepted"){
        return {bgColor: '#17963925', textColor: '#000'}
    }
    if(selectedTab === 'completed'){
        return {bgColor: '#ff000020', textColor: '#ff0000'}
    }

    return {bgColor: '#FFBF0030', textColor: '#000'}
};