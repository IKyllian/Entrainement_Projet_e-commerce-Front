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

export default function Order(userOrder = {}, action) {
    switch(action.type) {
        case 'createOrder' : {
            console.log('reducer',action.productsQuantity)
            return {
                ...userOrder, 
                    products : action.products,
                    productsQuantity: action.productsQuantity,
                    productsPrice : action.productsPrice,
                    deliveryPrice : action.deliveryPrice,
                    totalOrder : action.totalOrder
            }
        }
        case 'addOrderAddress' : {
            return {
                ...userOrder, 
                    address : action.fullAddress.address,
                    city : action.fullAddress.city,
                    zipCode : action.fullAddress.zipCode,
            }
        }
        case 'resetOrder' : {
            userOrder = {};

            return userOrder;
        }
        default : 
            return userOrder;


    }
}