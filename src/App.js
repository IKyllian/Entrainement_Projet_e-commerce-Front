import React, {useEffect} from 'react';
import './Styles/App.css';
import './Styles/home.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import SignIn from './Components/Sign/Signin';
import SignUp from './Components/Sign/Signup';
import Home from './Components/Home';
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
            props.userConnected(true)
            if(datas.user.homeAddress && datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode);
            } else if(datas.user.homeAddress && !datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, null, null, null);
            } else if(!datas.user.homeAddress && datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), null, null, null, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode);
            } else {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier,datas.user.productsQuantity,calculPrice(datas.user.panier, datas.user.productsQuantity), null, null, null, null, null, null);
            }
        } else {
          props.userConnected(false)
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
      </Switch>
    </Router>
  );
}

function mapStateToProps(state) {
  return {
    userIsConnected : state.UserConnected
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
      signUp: function(token, firstName, lastName, email, role, panier, productsQuantity, cartPrice, address_H, city_H, zipCode_H, address_S, city_S, zipCode_S) {
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
                address: address_H,
                city : city_H,
                zipCode : zipCode_H
            },
            secondaryAddress : {
              address: address_S,
              city : city_S,
              zipCode : zipCode_S
          }
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
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(App)