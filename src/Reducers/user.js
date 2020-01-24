export default function User(userDatas = {}, action) {
    if(action.type === 'sign') {
       // console.log('Reducers: User Datas', action)
        //coppie le state
        var cpyUser = {...userDatas};

        // remplie l'objet avec les données recus en front
        cpyUser.token = action.token;
        cpyUser.firstName = action.firstName;
        cpyUser.lastName = action.lastName;
        cpyUser.email = action.email;
        cpyUser.role = action.role;
        cpyUser.panier = action.panier;
        cpyUser.address = action.fullAddress.address;
        cpyUser.city = action.fullAddress.city;
        cpyUser.zipCode = action.fullAddress.zipCode;

        userDatas = cpyUser

        console.log('My reducer', cpyUser);
        return cpyUser
    } else if(action.type === 'logout'){
        var resetUser = {};

        userDatas = resetUser;

        return userDatas
    } else if(action.type === 'addProduct') {
        //coppie le state
        var cpyUser = {...userDatas};

        //Push l'id du nouveau produit dans le tableau panier du user 
        cpyUser.panier.push(action.idProduct);
        userDatas = cpyUser;
        console.log('My reducer',userDatas)
        return cpyUser
    } else if(action.type === 'addAddress') {
        var cpyUser = {...userDatas};
        
        cpyUser.address = action.fullAddress.address;
        cpyUser.city = action.fullAddress.city;
        cpyUser.zipCode = action.fullAddress.zipCode;

        console.log('My reducer AddAddress', cpyUser);

        userDatas = cpyUser;
        return cpyUser

    } else {
        return userDatas;
    }
}