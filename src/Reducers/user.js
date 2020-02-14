// export default function User(userDatas = {}, action) {
//     if(action.type === 'sign') {
//        // console.log('Reducers: User Datas', action)
//         //copie le state
//         var cpyUser = {...userDatas};

//         // remplie l'objet avec les données recus en front
//         cpyUser.token = action.token;
//         cpyUser.firstName = action.firstName;
//         cpyUser.lastName = action.lastName;
//         cpyUser.email = action.email;
//         cpyUser.role = action.role;
//         cpyUser.panier = action.panier;
//         cpyUser.homeAddress = {
//             address : action.homeAddress.address,
//             city : action.homeAddress.city,
//             zipCode : action.homeAddress.zipCode,
//         };
//         cpyUser.secondaryAddress = {
//             address : action.secondaryAddress.address,
//             city : action.secondaryAddress.city,
//             zipCode : action.secondaryAddress.zipCode,
//         }

//         userDatas = cpyUser

//         return cpyUser
//     } else if(action.type === 'logout'){
//         var resetUser = {};

//         userDatas = resetUser;

//         return userDatas
//     } else if(action.type === 'addProduct') {
//         //coppie le state
//         var cpyUser = {...userDatas};

//         //Push l'id du nouveau produit dans le tableau panier du user 
//         cpyUser.panier.push(action.idProduct);
//         userDatas = cpyUser;
//         return cpyUser
//     } else if(action.type === 'addAddress') {
//         var cpyUser = {...userDatas};
        
//         cpyUser.homeAddress.address = action.fullAddress.address;
//         cpyUser.homeAddress.city = action.fullAddress.city;
//         cpyUser.homeAddress.zipCode = action.fullAddress.zipCode;      

//         userDatas = cpyUser;
//         return cpyUser

//     } else if(action.type === 'resetPanier') {
//         var cpyUser = {...userDatas};
        
//         cpyUser.panier = [];
//         userDatas = cpyUser;

//         return cpyUser;

//     } else {
//         return userDatas;
//     }
// }

// function updateObject(oldObject, newValues) {
//     return Object.assign({}, oldObject, newValues);
// }

const defaultUserDatas = {};

export default function User(userDatas = defaultUserDatas, action) {
    switch(action.type) {
        case 'sign' : {
            return {
                ...userDatas, 
                    token : action.token,
                    firstName : action.firstName,
                    lastName : action.lastName,
                    email : action.email,
                    role : action.role,
                    panier : action.panier,
                    cartPrice : action.cartPrice,
                    homeAddress : {
                        address : action.homeAddress.address,
                        city : action.homeAddress.city,
                        zipCode : action.homeAddress.zipCode,
                    },
                    secondaryAddress : {
                        address : action.secondaryAddress.address,
                        city : action.secondaryAddress.city,
                        zipCode : action.secondaryAddress.zipCode,
                    }
            }
        }
        case 'userNotConnected' : {
            return {
                ...userDatas, 
                    panier : action.panier,
                    cartPrice : action.cartPrice
            }
        }
        case 'addProduct' : {
            const newProduct = userDatas.panier.concat(action.idProduct);

            //return updateObject(userDatas, { panier : newProduct });
            return {
                ...userDatas,
                    panier : newProduct,
                    cartPrice : userDatas.cartPrice + action.price,
            };

        }
        case 'addHomeAddress' : {
            return {
                ...userDatas,
                    homeAddress : {
                        address :action.fullAddress.address,
                        city : action.fullAddress.city,
                        zipCode : action.fullAddress.zipCode,
                    },
            }
            
        }
        case 'addSecondaryAddress' : {
            return {
                ...userDatas,
                    secondaryAddress : {
                        address :action.fullAddress.address,
                        city : action.fullAddress.city,
                        zipCode : action.fullAddress.zipCode,
                    },
            }
        }
        case 'resetPanier' : {
            //return updateObject(userDatas, { panier: [] });
            return {
                ...userDatas,
                    panier: [],
                    cartPrice : 0
            };
        }
        case 'logout' : {
            return defaultUserDatas
        }
        case 'deleteProduct' : {
            const deleteProduct = userDatas.panier.filter((value, index) => index !== action.index);

            // return updateObject(userDatas, { panier : deleteProduct });
            return {
                ...userDatas,
                    panier : deleteProduct,
                    cartPrice : userDatas.cartPrice - action.cartPrice
            }
        }
        default : 
            return userDatas
    }
}