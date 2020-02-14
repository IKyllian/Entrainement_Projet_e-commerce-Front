import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Button as AntButton, Checkbox, Icon, Popover, Input } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

import {adressIp} from '../config';
import Header from './Header';
import Footer from './Footer';
import ProgressOrder from './ProgressOrder' 
import CardAddressForm from './Card-AddressForm';
import CardTotal from './Card-Total';

function AddressForm(props) {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [statusCheckbox, setStatusCheckbox] = useState(false);
    const [disableCheckbox, setDisableCheckbox] = useState(false);
    const [nextStep, setNextStep] = useState(false);

    //Fonction pour aller créer l'adresse de la commande dans le back gace aux cookies
    var createOrderAddress = (_address, _city, _zipCode) => {
        var datasBody = JSON.stringify({
            address : _address,
            city : _city,
            zipCode : _zipCode
        })
        fetch(`http://${adressIp}:3000/createOrderAddress`, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: datasBody
        })
    }

    //Permet de desactiver l'option enregistrer une adresse, si le user en possède déjà 2
    useEffect(() => {
        if(props.userHomeAddress &&  props.userHomeAddress.address &&  props.userSecondaryAddress.address) {
            setDisableCheckbox(true);
        }
    }, [props.userHomeAddress, props.userSecondaryAddress])

    //Permet de récuperer les données de la commande (grace aux cookies), si le reducer perd les données au reload de la page
    useEffect(() => {
        if(!props.OrderProductsPrice || !props.OrderDeliveryPrice || !props.totalOrder) {
            fetch(`http://${adressIp}:3000/getCookiesOrder`, {
                withCredentials: true,
                credentials: 'include',
            })
            .then(response => {
                return response.json();
            })
            .then(datas => {
                props.getOrder(datas.cartCookies.products, datas.cartCookies.totalProductsPrice, datas.cartCookies.totalDeliveryPrice, datas.cartCookies.totalOrder);
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [props.userToken, props]);

    var confirmAddress = () => {
        if(address ==='' || city === '' || zipCode === '') {
            setNextStep(false);
        } else {
            props.addOrderAddress(address, city, zipCode);
            createOrderAddress(address, city, zipCode);

            if(statusCheckbox) {
                var datasBody = JSON.stringify({
                    userToken : props.userToken,
                    address : address,
                    city : city,
                    zipCode : zipCode
                })
        
                fetch(`http://${adressIp}:3000/addAddress`,
                {
                    method: 'POST',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Cache': 'no-cache'
                    },
                    body: datasBody
                })
                .then(function(response) {
                    return response.json();
                })
                .then(datas => {
                    //Reponse du backend qui permet de savoir si la création du compte a réussi
                    if(datas.addHomeAddress) {
                        props.addHomeAddress(datas.result.homeAddress.address, datas.result.homeAddress.city, datas.result.homeAddress.zipCode);
                    } else {
                        props.addSecondaryAddress(datas.result.secondaryAddress.address, datas.result.secondaryAddress.city, datas.result.secondaryAddress.zipCode);
                    }

                })
                .catch(function(err) {
                    console.log(err);
                })
            }
            setNextStep(true)
        }
    }

    const handleHomeAddress = () => {
        props.addOrderAddress(props.userHomeAddress.address, props.userHomeAddress.city, props.userHomeAddress.zipCode);
        createOrderAddress(props.userHomeAddress.address, props.userHomeAddress.city, props.userHomeAddress.zipCode);
    }

    const handleSecondaryAddress = () => {
        props.addOrderAddress(props.userSecondaryAddress.address, props.userSecondaryAddress.city, props.userSecondaryAddress.zipCode);
        createOrderAddress(props.userSecondaryAddress.address, props.userSecondaryAddress.city, props.userSecondaryAddress.zipCode);
    }

    function onChange(e) {
        setStatusCheckbox(e.target.checked)
    }

    if(!props.isConnected) {
        return (
            <Redirect to='/Panier' />
        );
    } else if(props.userPanier && props.userPanier < 1) {
        return (
            <Redirect to='/Panier' />
        );
    } else {
        return(
            <Container fluid={true}>
                <Header />
                <Row>
                    <Col  lg={{size: 10, offset:1 }} style={{minHeight: '65vh', marginTop: '2em', marginBottom: '3em'}}>
                    <ProgressOrder index={1}  /> 
                    <Row>
                        <Col lg={{size: 8, offset: 0}} sm={{size: 10, offset:1}} className='container-address'>
                            <div className='container-user-address'>
                                <Row md='2'>
                                    <CardAddressForm addressObject={props.userHomeAddress} addressNumber={1} addFunction={handleHomeAddress} />
                                    <CardAddressForm addressObject={props.userSecondaryAddress} addressNumber={2} addFunction={handleSecondaryAddress} />
                                </Row>
                            </div>
                            <div>
                                <h3> Ajouter une adresse de livraison</h3>
                                <div className='form-address'>
                                    <Input className='input-form-address' value={props.userFirstName} disabled={true} />
                                    <Input className='input-form-address' value={props.userLastName} disabled={true} />
                                    <Input className='input-form-address' placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
                                    <div className='form-address-row'>
                                        <Input className='input-form-address input-marge' placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
                                        <Input className='input-form-address' placeholder="Code postal" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                                    </div>
                                </div>
                                <Checkbox className='checkbox-address' onChange={onChange} disabled={disableCheckbox}>Enregistrer cette adresse</Checkbox>
                                <Popover content='Vous ne pouvez pas enregistrer plus de deux adresses' placement="bottom">
                                    <Icon type="question-circle" theme="twoTone" style={{fontSize: '14px'}}/>
                                </Popover>
                                <Link to={{ pathname: 'PaymentConfirm' }}>
                                    <Button color="info" className='float-right buton-form-address' onClick={() => confirmAddress()}> Valider votre adresse </Button>
                                </Link>
                            </div>
                        </Col>
                        
                        <Col lg={{size: 4, offset:0}} xs={{size: 8, offset: 2}} md={{size: 6, offset: 3}} className='mt-lg-0 mt-md-5 mt-sm-5'>
                            <CardTotal productsPrice={props.OrderProductsPrice} deliveryPrice={props.OrderDeliveryPrice} totalPrice={props.totalOrder} />
                        </Col>
                    </Row>
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
        userToken: state.User.token,
        userPanier : state.User.panier,
        userFirstName: state.User.firstName,
        userLastName: state.User.lastName,
        userHomeAddress: state.User.homeAddress,
        userSecondaryAddress: state.User.secondaryAddress,
        OrderProductsPrice: state.Order.productsPrice,
        OrderDeliveryPrice: state.Order.deliveryPrice,
        totalOrder : state.Order.totalOrder
    }
}


function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        addHomeAddress: function(address, city, zipCode) {
            dispatch({
                type: 'addHomeAddress',
                fullAddress: {
                    address : address,
                    city : city,
                    zipCode : zipCode
                }
            })
        },
        addSecondaryAddress: function(address, city, zipCode) {
            dispatch({
                type: 'addSecondaryAddress',
                fullAddress: {
                    address : address,
                    city : city,
                    zipCode : zipCode
                }
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
        getOrder : function(products, productsPrice, deliveryPrice, totalOrder) {
            dispatch({
                type : 'createOrder',
                products : products,
                productsPrice : productsPrice,
                deliveryPrice : deliveryPrice,
                totalOrder : totalOrder
            })
        },
    }
}


export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AddressForm)