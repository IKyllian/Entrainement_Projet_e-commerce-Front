import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import User from './Reducers/user';
import UserConnected from './Reducers/userConnected';
import Order from './Reducers/order';
import './Styles/index.css';
import './Styles/home.css';
import './Styles/header.css';
import './Styles/productPage.css';
import './Styles/catalogue.css';
import './Styles/panier.css';
import './Styles/footer.css';
import './Styles/addressForm.css';
import './Styles/paymentConfirm.css';
import './Styles/similarProduct.css';
import './Styles/sign.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css'
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(combineReducers({User, UserConnected, Order}));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    ,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
