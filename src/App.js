import React, { useEffect, useState } from 'react';
import './Styles/App.css';
import './Styles/home.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { notification } from 'antd';

import SignIn from './Components/Sign/Signin';
import SignUp from './Components/Sign/Signup';
import Home from './Components/Home/Home';
import ProductPage from './Components/ProductPage/ProductPage';
import Catalogue from './Components/Catalogue/Catalogue';
import Panier from './Components/Panier-Order/Panier';
import AddressForm from './Components/Panier-Order/AddressForm';
import PaymentConfirm from './Components/Panier-Order/PaymentConfirm';
import ProfilPage from './Components/Profile-Pages/ProfilPage';
import ProfilPageOrders from './Components/Profile-Pages/Orders';
import AdminUsersList from './Components/Admin/User-List'
import AdminProductsList from './Components/Admin/Products-List'
import AdminOrdersList from './Components/Admin/Orders-List'
import AdminAddProduct from './Components/Admin/Add-Product'
import AdminEditProduct from './Components/Admin/Edit-Product'
import AdminDataChart from './Components/Admin/Data-Chart'
import AdminOrderDesc from './Components/Admin/Order-Desc'
import AdminMessagesList from './Components/Admin/Messages-List'
import ContactForm from './Components/Contact-Form';
import SpinLoad from './Components/SpinLoad';

import {adressIp} from './config';
import {connect} from 'react-redux';

const calculPrice = (array, arrayQuantity) => {
  var totalPrice = 0
  if(array.length < 1) {
    return totalPrice;
  } else {
    for(var i = 0; i < array.length; i++) {
      totalPrice += array[i].price * arrayQuantity[i];
    };
    return totalPrice;
  }
  
}

function App(props) {
  const [pageIsLoad, setPageIsLoad] = useState(false);

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Vous êtes connecté',
      description: `Bonjour ${props.userFirstName && props.userLastName ? `${props.userFirstName} ${props.userLastName}` : ' '} `,
    });
  };

  useEffect(() => {
    console.log(props.userIsLog)
    if(props.userIsLog) {
      openNotificationWithIcon('success');
    }
    
  }, [props.userIsLog])

    useEffect(() => {
        if(props.userRole === 'default') {
            setPageIsLoad(false);
        } else {
            setPageIsLoad(true)
        }
    }, [props.userRole])

  useEffect(() => {
    fetch(`http://${adressIp}:3000/users/checkUserConnected`, {
        withCredentials: true,
        credentials: 'include',
    })
    .then(response => {
        return response.json();
    })
    .then(datas => {
        if(datas.userConnected) {
            props.userConnected(true);
            props.changeUserStatus(true);
            if(datas.user.homeAddress && datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), datas.user.homeAddress.name, datas.user.homeAddress.address, datas.user.homeAddress.additional_address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, datas.user.secondaryAddress.name, datas.user.secondaryAddress.address, datas.user.secondaryAddress.additional_address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
            } else if(datas.user.homeAddress && !datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), datas.user.homeAddress.name, datas.user.homeAddress.address, datas.user.homeAddress.additional_address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, null, null, null, null, null, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
            } else if(!datas.user.homeAddress && datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), null, null, null, null, null, datas.user.secondaryAddress.name, datas.user.secondaryAddress.address, datas.user.secondaryAddress.additional_address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
            } else {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), null, null, null, null, null, null, null, null, null, null, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
            }
        } else {
          props.userConnected(false);
          props.changeUserStatus(false);
          if(!datas.cartOnCookies) {
            props.userNotConnected([], [], 0);
          } else {
            props.userNotConnected(datas.cartOnCookies.products, datas.cartOnCookies.productsQuantity, calculPrice(datas.cartOnCookies.products, datas.cartOnCookies.productsQuantity));
          }
        }
    })
    .catch(err => {
        console.log(err)
    })
  }, [props])

  if(!pageIsLoad){
    return (
      <SpinLoad />
    )
  } else {
    return (
      <Router>
        <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/Signin' component={SignIn} />
            <Route path='/Signup' component={SignUp} />
            <Route path='/Product/:id' component={ProductPage} />
            <Route path='/Catalogue' component={Catalogue} />
            <Route path='/Panier' component={Panier} />
            <Route path='/AddressForm' component={AddressForm} />
            <Route path='/PaymentConfirm' component={PaymentConfirm} />
            <Route path='/ProfilPage' component={ProfilPage} />
            <Route path='/ProfilPageOrders' component={ProfilPageOrders} />
            <Route path='/AdminUserList' component={AdminUsersList} />
            <Route path='/AdminProductsList' component={AdminProductsList} />
            <Route path='/AdminOrdersList' component={AdminOrdersList} />
            <Route path='/AdminAddProduct' component={AdminAddProduct} />
            <Route path='/AdminEditProduct/:id' component={AdminEditProduct} />
            <Route path='/AdminDataChart' component={AdminDataChart} />
            <Route path='/AdminOrderDesc/:id' component={AdminOrderDesc} />
            <Route path='/AdminMessagesList' component={AdminMessagesList} />
            <Route path='/ContactForm' component={ContactForm} />
        </Switch>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  console.log('state', state)
  return {
    userFirstName: state.User.firstName,
    userLastName: state.User.lastName,
    userIsConnected : state.UserConnected,
    userRole: state.User.role,
    userIsLog: state.User.userIsLog
  }
}

function mapDispatchToProps(dispatch) {
  //Dispatch les données recus depuis le backend
  return {
      userConnected: function(isConnected) {
          dispatch({
              type: 'changeStatus',
              isConnected: isConnected
          })
      },
      signUp: function(token, firstName, lastName, email, role, panier, productsQuantity, cartPrice, name_H, address_H, additionalAddress_H, city_H, zipCode_H, name_S, address_S, additionalAddress_S, city_S, zipCode_S, background_profil, soldPoints, discountCodes) {
          dispatch({
            type: 'sign',
            token: token,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
            panier: panier,
            productsQuantity : productsQuantity,
            cartPrice : cartPrice,
            homeAddress : {
                name: name_H,
                address: address_H,
                additionalAddress: additionalAddress_H,
                city : city_H,
                zipCode : zipCode_H
            },
            secondaryAddress : {
              name: name_S,
              address: address_S,
              additionalAddress: additionalAddress_S,
              city : city_S,
              zipCode : zipCode_S
            },
            background_profil: background_profil,
            soldPoints : soldPoints,
            discountCodes: discountCodes
          })
      },
      userNotConnected: function(panier, productsQuantity,  price) {
        dispatch({
            type: 'userNotConnected',
            panier: panier,
            productsQuantity: productsQuantity,
            cartPrice : price
        })
      },
      changeUserStatus: function(isLog) {
        dispatch({
          type: 'UserIsLog',
          userIsLog : isLog
        })
      },
    }
  }

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(App)