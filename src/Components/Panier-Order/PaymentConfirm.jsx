import React, {useEffect} from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Descriptions, Collapse } from 'antd';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {connect} from 'react-redux';

import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
import CheckoutForm from './CheckoutForm'
import ProgressOrder from './ProgressOrder' 
import {adressIp} from '../../config';
import { Redirect } from 'react-router-dom';

const { Panel } = Collapse;

function PaymentConfirm(props){
    useEffect(() => {
        if(!props.OrderProductsPrice || !props.OrderDeliveryPrice || !props.totalOrder || !props.orderAddress || !props.orderCity || !props.orderZipCode) {
            fetch(`http://${adressIp}:3000/getCookiesOrder`, {
                withCredentials: true,
                credentials: 'include',
            })
            .then(response => {
                return response.json();
            })
            .then(datas => {
                console.log('azeazeaze', datas)
                if(datas) {
                    props.getOrder(datas.cartCookies.products, datas.cartCookies.productsQuantity, datas.cartCookies.totalProductsPrice, datas.cartCookies.totalDeliveryPrice, datas.cartCookies.totalOrder);
                    props.addOrderAddress(datas.addressOrderCookies.address, datas.addressOrderCookies.city, datas.addressOrderCookies.zipCode)
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [props.userToken, props]);

    if(!props.isConnected) {
        return (
            <Redirect to='Panier' />
        );
    }
    //  else if(!props.orderAddress || !props.orderCity) {
    //     return (
    //         <Redirect to='AddressForm' />
    //     );
    // }
     else {
        return(
            <Container fluid={true}>
                <Header />
                <Row>
                    <Col  md={{size: 10, offset:1 }} style={{minHeight: '65vh', marginTop: '2em', marginBottom: '3em'}}>
                        <ProgressOrder index={2} /> 
                        <Collapse defaultActiveKey={['1']}  >
                            <Panel header="Récapitulatif de votre commande" key="1" >
                                <div style={{padding: '2em'}}>
                                    <Descriptions >
                                        <Descriptions.Item label="Nom-Prenom">{props.userFirstName} {props.userLastName}</Descriptions.Item>
                                        <Descriptions.Item label="Adresse mail">{props.userEmail}</Descriptions.Item>
                                        <Descriptions.Item label="Adresse">{props.orderAddress}</Descriptions.Item>
                                        <Descriptions.Item label="Ville"> {props.orderCity}</Descriptions.Item>
                                        <Descriptions.Item label="Zip Code">{props.orderZipCode}</Descriptions.Item>
                                        <Descriptions.Item label="Frais livraison">{props.orderDeliveryPrice} €</Descriptions.Item>
                                        <Descriptions.Item label="Montant panier">{props.orderProductsPrice} €</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </Panel>
                        </Collapse>
                        <div className='container-payment'>
                            <StripeProvider apiKey="pk_test_n9MNHSqODl25K5GFwfLxbZC5007vhFerIxx">
                                <div className="example">
                                    <h5 className='text-center'> Paiement par carte </h5>
                                    <Elements>
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
    //Récupere les données depuis le reducer
    return {
        isConnected : state.UserConnected,
        userToken : state.User.token,
        userFirstName: state.User.firstName,
        userLastName: state.User.lastName,
        userEmail: state.User.email,
        orderAddress: state.Order.address,
        orderCity: state.Order.city,
        orderZipCode: state.Order.zipCode,
        orderProductsPrice: state.Order.productsPrice,
        orderDeliveryPrice: state.Order.deliveryPrice,
        totalOrder: state.Order.totalOrder,
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
        addOrderAddress: function(address, city, zipCode) {
            dispatch({
                type: 'addOrderAddress',
                fullAddress: {
                    address : address,
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