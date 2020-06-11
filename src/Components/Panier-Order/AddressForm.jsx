import React, { useState, useEffect } from 'react';
import { Container, Row, Col,  } from 'reactstrap';
import { Button , Checkbox, Icon, Popover, Input, Form, notification } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

import {adressIp} from '../../config';
import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
import ProgressOrder from './ProgressOrder' 
import CardAddressForm from './Card-AddressForm';
import CardTotal from './Card-Total';

function AddressForm(props) {
    const [nameAddress, setNameAddress] = useState('');
    const [address, setAddress] = useState('');
    const [additionalAddress, setAdditionalAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [statusCheckbox, setStatusCheckbox] = useState(false);
    const [disableCheckbox, setDisableCheckbox] = useState(false);
    //const [nextStep, setNextStep] = useState(false);

    const [statusNameAddress, setStatusNameAddress] = useState('');
    const [statusAddress, setStatusAddress] = useState('');
    const [statusCity, setStatusCity] = useState('');
    const [statusZipCode, setStatusZipCode] = useState('');

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            `Un problème est survenue lors de l'ajout de votre adresse a votre compte, veuillez réesayer plus tard si cela persiste`,
        });
    };

    //Fonction pour aller créer l'adresse de la commande dans le back gace aux cookies
    var createOrderAddress = (_nameAddress, _address, _additionalAddress, _city, _zipCode) => {
        var datasBody = JSON.stringify({
            nameAddress: _nameAddress,
            address : _address,
            city : _city,
            zipCode : _zipCode,
            additionalAddress: _additionalAddress
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
                props.getOrder(datas.cartCookies.products, datas.cartCookies.productsQuantity,  datas.cartCookies.totalProductsPrice, datas.cartCookies.totalDeliveryPrice, datas.cartCookies.totalOrder, datas.cartCookies.discount, datas.cartCookies.discountId);
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [props.userToken, props]);

    var confirmAddress = () => {
        if(nameAddress === '' || address === '' || city === '' || zipCode === '') {
            nameAddress === '' ? setStatusNameAddress('error') : setStatusNameAddress('success');
            address === '' ? setStatusAddress('error') : setStatusAddress('success');
            city === '' ? setStatusCity('error') : setStatusCity('success');
            zipCode === '' ? setStatusZipCode('error') : setStatusZipCode('success');
        } else {
            props.addOrderAddress(nameAddress, address, additionalAddress, city, zipCode);
            createOrderAddress(nameAddress, address, additionalAddress, city, zipCode);

            if(statusCheckbox) {
                var datasBody = JSON.stringify({
                    userToken : props.userToken,
                    name: nameAddress,
                    address : address,
                    additionalAddress: additionalAddress,
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
                    if(!datas.errAdd) {
                        //Reponse du backend qui permet de savoir si la création du compte a réussi
                        if(datas.addHomeAddress) {
                            props.addHomeAddress(datas.result.homeAddress.name, datas.result.homeAddress.address, datas.result.homeAddress.additional_address, datas.result.homeAddress.city, datas.result.homeAddress.zipCode);
                        } else {
                            props.addSecondaryAddress(datas.result.secondaryAddress.name, datas.result.secondaryAddress.address, datas.result.secondaryAddress.additional_address, datas.result.secondaryAddress.city, datas.result.secondaryAddress.zipCode);
                        }
                    } else {
                        openNotificationWithIcon('error');
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
            }    
        }
    }

    const handleHomeAddress = () => {
        props.addOrderAddress(props.userHomeAddress.name, props.userHomeAddress.address, props.userHomeAddress.additionalAddress, props.userHomeAddress.city, props.userHomeAddress.zipCode);
        createOrderAddress(props.userHomeAddress.name, props.userHomeAddress.address, props.userHomeAddress.additionalAddress, props.userHomeAddress.city, props.userHomeAddress.zipCode);
    }

    const handleSecondaryAddress = () => {
        props.addOrderAddress(props.userSecondaryAddress.name, props.userSecondaryAddress.address, props.userSecondaryAddress.additionalAddress, props.userSecondaryAddress.city, props.userSecondaryAddress.zipCode);
        createOrderAddress(props.userSecondaryAddress.name, props.userSecondaryAddress.address, props.userSecondaryAddress.additionalAddress, props.userSecondaryAddress.city, props.userSecondaryAddress.zipCode);
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
            <Container fluid={true} className='container-address-form-page'>
                <Header />
                <Row>
                    <Col  lg={{size: 10, offset:1 }} style={{minHeight: '65vh', marginTop: '2em', marginBottom: '3em'}}>
                    <ProgressOrder index={1}  /> 
                    <Row>
                        <Col lg={{size: 8, offset: 0}} sm={{size: 10, offset:1}} className='container-address'>
                            <div className='container-user-address-card'>
                                <Row sm='2' xs='1'>
                                    <CardAddressForm addressObject={props.userHomeAddress} addressNumber={1} addFunction={handleHomeAddress} />
                                    <CardAddressForm addressObject={props.userSecondaryAddress} addressNumber={2} addFunction={handleSecondaryAddress} />
                                </Row>
                            </div>
                            <div className='form-container-responsive'>
                                <h3> Ajouter une adresse de livraison</h3>
                                <div className='form-address'>
                                    <Form layout='vertical'>
                                        <Form.Item validateStatus={statusNameAddress} hasFeedback>
                                            <Input className='input-form-address' placeholder='Nom' value={nameAddress} onChange={(e) => setNameAddress(e.target.value)} />
                                        </Form.Item>
                                        <Form.Item validateStatus={statusAddress} hasFeedback>
                                            <Input className='input-form-address' placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Input className='input-form-address' placeholder={'Complément d\'adresse (Facultatif)'} value={additionalAddress} onChange={(e) => setAdditionalAddress(e.target.value)} />
                                        </Form.Item>
                                        <div className='form-address-row'>
                                            <Form.Item validateStatus={statusCity} hasFeedback>
                                                <Input className='input-form-address-row ' placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
                                            </Form.Item>
                                            <Form.Item validateStatus={statusZipCode} hasFeedback>
                                                <Input className='input-form-address-row input-marge' placeholder="Code postal" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                                            </Form.Item>
                                        </div>
                                    </Form>
                                </div>
                                <Checkbox className='checkbox-address' onChange={onChange} disabled={disableCheckbox}>Enregistrer l'adresse</Checkbox>
                                <Popover content='Vous ne pouvez pas enregistrer plus de deux adresses' placement="bottom">
                                    <Icon type="question-circle" theme="twoTone" style={{fontSize: '14px'}}/>
                                </Popover>
                                <Link to='/PaymentConfirm'>
                                    <Button  type='primary' color="info" className='buton-form-address' onClick={() => confirmAddress()}> Valider votre adresse </Button>
                                </Link>
                            </div>
                        </Col>
                        <Col lg={{size: 4, offset:0}} xs={{size: 8, offset: 2}} md={{size: 6, offset: 3}} className='mt-lg-0 mt-md-5 mt-sm-5'>
                            <CardTotal productsPrice={props.OrderProductsPrice} deliveryPrice={props.OrderDeliveryPrice} totalPrice={props.totalOrder} buttonDisplay={null} discountCoupon={props.discountOrder} _deleteDiscount={null} />
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
    console.log(state);
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
        totalOrder : state.Order.totalOrder,
        discountOrder : state.Order.discount
    }
}


function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        addHomeAddress: function(name, address, additionalAddress, city, zipCode) {
            dispatch({
                type: 'addHomeAddress',
                fullAddress: {
                    name: name,
                    address : address,
                    additionalAddress: additionalAddress,
                    city : city,
                    zipCode : zipCode
                }
            })
        },
        addSecondaryAddress: function(name, address, additionalAddress, city, zipCode) {
            dispatch({
                type: 'addSecondaryAddress',
                fullAddress: {
                    name: name,
                    address : address,
                    additionalAddress: additionalAddress,
                    city : city,
                    zipCode : zipCode
                }
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
        getOrder : function(products, productsQuantity,  productsPrice, deliveryPrice, totalOrder, discount, discountId) {
            dispatch({
                type : 'createOrder',
                products : products,
                productsQuantity : productsQuantity,
                productsPrice : productsPrice,
                deliveryPrice : deliveryPrice,
                totalOrder : totalOrder,
                discount: discount,
                discountId: discountId
            })
        },
    }
}


export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AddressForm)