const defaultValues = {
    discountCouponValue : null,
    discountId: null
}
export default function Panier(panier = defaultValues, action) {
    switch(action.type) {
        case 'addDiscountCoupon' : {
            return {
                ...panier,
                    discountCouponValue: action.discountCouponValue,  
                    discountId: action.discountId
            }
        }
        case 'deleteDiscountCoupon' : {
            return defaultValues
        }
        default :
            return panier;
    }
}