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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        },
        withCredentials: true,
        credentials: 'include',
    })
    .then(response => {
        return response.json();
    })
    .then(datas => {
        if(datas.userConnected) {
            props.userConnected(true)
            props.signUp(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.fullAddress.address, datas.user.fullAddress.city, datas.user.fullAddress.zipCode);
        } else {
            console.log('USer Not connected')
        }
    })
    .catch(err => {
        console.log(err)
    })
}, [])

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

function mapDispatchToProps(dispatch) {
  //Dispatch les données recus depuis le backend
  return {
      userConnected: function(isConnected) {
          dispatch({
              type: 'changeStatus',
              isConnected: isConnected
          })
      },
      signUp: function(token, firstName, lastName, email, role, panier, address, city, zipCode) {
          dispatch({
            type: 'sign',
            token: token,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
            panier: panier,
            fullAddress : {
                address: address,
                city : city,
                zipCode : zipCode
            } 
          })
      },
  }
}

export default connect(
  null, 
  mapDispatchToProps
)(App)