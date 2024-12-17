import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export async function updateShippingQuote({
    data,
    order_id
}: {
    data: ShippingQuoteTypes,
    order_id: string
}){

    try {
        const response = await fetch(apiUrl + '/api/orders/updateOrderShippingQuote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
            },
            body: JSON.stringify({data, order_id}),
        })
        .then(async (res) => {
            const result = await res.json();
            return { isOk: res.ok, message: result.message, data: result.data};
        })

        return response
    }catch(error){
        console.log('error' + error)
        return {
            isOk: false,
            body: {message: 'Error updating order status'}
        }
    }

}