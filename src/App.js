import React, {useEffect} from 'react';
import './Styles/App.css';
import './Styles/home.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import SignIn from './Components/Signin';
import SignUp from './Components/Signup';
import Home from './Components/Home';
import ProductPage from './Components/ProductPage';
import Catalogue from './Components/Catalogue';
import Panier from './Components/Panier';
import AddressForm from './Components/AddressForm';
import PaymentConfirm from './Components/PaymentConfirm';

import {adressIp} from './config';
import {connect} from 'react-redux';

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
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode);
            } else if(datas.user.homeAddress && !datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, null, null, null);
            } else if(!datas.user.homeAddress && datas.user.secondaryAddress) {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, null, null, null, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode);
            } else {
              props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, null, null, null, null, null, null);
            }
        } else {
          if(!datas.cartOnCookies) {
            props.userNotConnected([]);
          } else {
            props.userNotConnected(datas.cartOnCookies.panier);
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
      </Switch>
    </Router>
  );
}

function mapStateToProps(state) {
  console.log(state)
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
      signUp: function(token, firstName, lastName, email, role, panier, address_H, city_H, zipCode_H, address_S, city_S, zipCode_S) {
          dispatch({
            type: 'sign',
            token: token,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
            panier: panier,
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
      userNotConnected: function(panier) {
        dispatch({
            type: 'userNotConnected',
            panier: panier
        })
    },
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(App)