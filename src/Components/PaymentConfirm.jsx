import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Descriptions } from 'antd';
import { Collapse } from 'antd';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {connect} from 'react-redux';

import Header from './Header';
import Footer from './Footer';
import CheckoutForm from './CheckoutForm'
import ProgressOrder from './ProgressOrder' 

const { Panel } = Collapse;

function PaymentConfirm(props){

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
                                <h5 className='text-center'> Paiment par carte </h5>
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


function mapStateToProps(state) {
    //Récupere les données depuis le reducer
    return {
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

export default connect(
    mapStateToProps, 
    null
)(PaymentConfirm)