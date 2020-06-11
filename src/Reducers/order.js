// export default function Order(userOrder = {}, action) {
//     if(action.type === 'createOrder') {
//         var cpyUserOrder = {...userOrder};

//         cpyUserOrder.products = action.products;
//         cpyUserOrder.productsPrice = action.productsPrice;
//         cpyUserOrder.deliveryPrice = action.deliveryPrice;
//         cpyUserOrder.totalOrder = action.totalOrder

//         console.log('My Order Reducer', cpyUserOrder);

//         userOrder = cpyUserOrder;
//         return cpyUserOrder
//     } else if(action.type === 'addOrderAddress') {
//         var cpyUserOrder = {...userOrder};
        
//         cpyUserOrder.address = action.fullAddress.address;
//         cpyUserOrder.city = action.fullAddress.city;
//         cpyUserOrder.zipCode = action.fullAddress.zipCode;

//         console.log('add address order Reducer', cpyUserOrder);

//         userOrder = cpyUserOrder;
//         return cpyUserOrder
//     } else if(action.type === 'resetOrder') {
//         var resetOrder = {}

//         userOrder = resetOrder;

//         console.log('Reset ORder', userOrder)
//         return userOrder
//     } else {
//         return userOrder;
//     }
// }

const defaultState = {
    name: null,
    address :null,
    additionalAddress: null,
    city : null,
    zipCode : null,
}

export default function Order(userOrder = defaultState, action) {
    switch(action.type) {
        case 'createOrder' : {
            return {
                ...userOrder, 
                    products : action.products,
                    productsQuantity: action.productsQuantity,
                    productsPrice : action.productsPrice,
                    deliveryPrice : action.deliveryPrice,
                    totalOrder : action.totalOrder,
                    discount : action.discount,
                    discountId: action.discountId
            }
        }
        case 'addOrderAddress' : {
            return {
                ...userOrder,
                    name: action.fullAddress.name,
                    address : action.fullAddress.address,
                    additionalAddress: action.fullAddress.additionalAddress,
                    city : action.fullAddress.city,
                    zipCode : action.fullAddress.zipCode,
            }
        }
        case 'resetOrder' : {
            return defaultState;
        }
        default : 
            return userOrder;
    }
}