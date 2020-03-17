import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Descriptions, Collapse } from 'antd';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {connect} from 'react-redux';
import {loadStripe} from '@stripe/stripe-js';


import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
import CheckoutForm from './CheckoutForm'
import ProgressOrder from './ProgressOrder' 
import {adressIp} from '../../config';
import { Redirect } from 'react-router-dom';

const { Panel } = Collapse;
const stripePromise = loadStripe("pk_test_n9MNHSqODl25K5GFwfLxbZC5007vhFerIx");

function PaymentConfirm(props){
    useEffect(() => {
            fetch(`http://${adressIp}:3000/getCookiesOrder?userToken=${props.userToken}`, {
                withCredentials: true,
                credentials: 'include',
            })
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    props.getOrder(datas.cartCookies.products, datas.cartCookies.productsQuantity, datas.cartCookies.totalProductsPrice, datas.cartCookies.totalDeliveryPrice, datas.cartCookies.totalOrder);
                    if(datas.addressOrderCookies) {
                        props.addOrderAddress(datas.addressOrderCookies.name, datas.addressOrderCookies.address, datas.addressOrderCookies.additional_address, datas.addressOrderCookies.city, datas.addressOrderCookies.zipCode)
                    } else {
                        props.addOrderAddress(undefined, undefined, undefined, undefined, undefined)
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [props.userToken]);

    if(!props.isConnected) {
        return (
            <Redirect to='Panier' />
        );
    }
     else if(props.orderNameAddress === undefined || props.orderAddress === undefined) {
        return (
            <Redirect to='AddressForm' />
        );
    }
     else {
        return(
            <Container fluid={true}>
                <Header />
                <Row>
                    <Col md={{size: 10, offset:1 }} style={{minHeight: '65vh', marginTop: '2em', marginBottom: '3em'}}>
                        <ProgressOrder index={2} /> 
                        <Collapse defaultActiveKey={['1']}  >
                            <Panel header="Récapitulatif de votre commande" key="1" >
                                <div style={{padding: '2em'}}>
                                    <Descriptions >
                                        <Descriptions.Item label="Adresse mail">{props.userEmail}</Descriptions.Item>
                                        <Descriptions.Item label="Nom d'adresse">{props.orderNameAddress} </Descriptions.Item>
                                        <Descriptions.Item label="Adresse">{props.orderAddress}</Descriptions.Item>
                                        {
                                            props.orderAdditionalAddres !== '' &&
                                            <Descriptions.Item label="Complément d'adresse">{props.orderAdditionalAddress}</Descriptions.Item>
                                        }
                                        <Descriptions.Item label="Ville"> {props.orderCity}</Descriptions.Item>
                                        <Descriptions.Item label="Zip Code">{props.orderZipCode}</Descriptions.Item>
                                        <Descriptions.Item label="Frais livraison">{props.orderDeliveryPrice} €</Descriptions.Item>
                                        <Descriptions.Item label="Montant panier">{props.orderProductsPrice} €</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </Panel>
                            {/* <Panel header='Récapitulatif des produits' key='2' >
                                <ul className='product-list'> 
                                    {productsCart && 
                                       productsCart.length >= 1 &&
                                       productsCart.map((items, i) => (
                                        <li key={i} className='items-product-list'>
                                            <Badge count={props.orderProductsQuantity[i]} showZero>
                                                <div className='img-product-list-commande' style={{backgroundImage: `url(${items.images})`}}>  </div>
                                            </Badge>
                                            <div className='product-info' >
                                                <h5 className='title-product-list'> {items.name} </h5>
                                                <p className='attribute-product-list'> Type: {items.type} </p>
                                            </div>
                                            <div className='price-info ml-md-5'>
                                                <h6 className='price-bold'> {items.price} €</h6>
                                            </div>    
                                        </li>
                                    ))}    
                                </ul>
                            </Panel> */}
                        </Collapse>
                        <div className='container-payment'>
                            <StripeProvider apiKey="pk_test_n9MNHSqODl25K5GFwfLxbZC5007vhFerIxx">
                                <div className="example">
                                    <h5 className='text-center'> Paiement par carte </h5>
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm />
                                    </Elements>
                                </div>
                            </StripeProvider>
                        </div>
                    </Col>
                </Row>
                <Footer />
            </Container>
        );
    }
}


function mapStateToProps(state) {
    console.log(state)
    //Récupere les données depuis le reducer
    return {
        isConnected : state.UserConnected,
        userToken : state.User.token,
        userEmail: state.User.email,
        orderNameAddress: state.Order.name,
        orderAddress: state.Order.address,
        orderAdditionalAddress: state.Order.additionalAddress,
        orderCity: state.Order.city,
        orderZipCode: state.Order.zipCode,
        orderProductsPrice: state.Order.productsPrice,
        orderDeliveryPrice: state.Order.deliveryPrice,
        totalOrder: state.Order.totalOrder,
        orderProducts: state.Order.products,
        orderProductsQuantity: state.Order.productsQuantity
    }
}

function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        getOrder : function(products, productsQuantity, productsPrice, deliveryPrice, totalOrder) {
            dispatch({
                type : 'createOrder',
                products : products,
                productsQuantity: productsQuantity,
                productsPrice : productsPrice,
                deliveryPrice : deliveryPrice,
                totalOrder : totalOrder
            })
        },
        addOrderAddress: function(name, address, additionalAddress, city, zipCode) {
            dispatch({
                type: 'addOrderAddress',
                fullAddress: {
                    name: name,
                    address : address,
                    additionalAddress: additionalAddress,
                    city : city,
                    zipCode : zipCode
                }
            })
        },
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(PaymentConfirm)