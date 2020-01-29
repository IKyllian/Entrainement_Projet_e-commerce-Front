import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Input } from 'antd';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {adressIp} from '../config';
import { Button as AntButton } from 'antd';
import { Checkbox } from 'antd';

import Header from './Header';
import Footer from './Footer';
import ProgressOrder from './ProgressOrder' 

function AddressForm(props) {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [statusCheckbox, setStatusCheckbox] = useState(false);

    console.log('AZEAZEAZEAZEAZEAZE', props.userToken)
    var confirmAddress = () => {
        props.addOrderAddress(address, city, zipCode)

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
                console.log(datas);
                props.addAddress(datas.result.homeAddress.address, datas.result.homeAddress.city, datas.result.homeAddress.zipCode);

            })
            .catch(function(err) {
                console.log(err);
            })
        }
    }

    var handleHomeAddress = () => {
        props.addOrderAddress(props.userHomeAddress.address, props.userHomeAddress.city, props.userHomeAddress.zipCode)
    }

    var handleSecondaryAddress = () => {
        props.addOrderAddress(props.userSecondaryAddress.address, props.userSecondaryAddress.city, props.userSecondaryAddress.zipCode)
    }
    function onChange(e) {
        setStatusCheckbox(e.target.checked)
    }

    console.log('MY CHECKBOX', statusCheckbox)

    let homeAddressElement;
    let secondaryAddressElement;

    if(props.userHomeAddress && props.userHomeAddress.address) {
        homeAddressElement = 
            <Col> 
                <div className='container-item-address'>
                    <h5> Adresse de domicile </h5>
                    <div className='address-info'>
                        <p> Adresse : {props.userHomeAddress.address}</p>
                        <p> Ville : {props.userHomeAddress.city} </p>
                        <p> Code Postal : {props.userHomeAddress.zipCode}</p>
                    </div>
                    <Link to='/PaymentConfirm'>
                        <AntButton className='button-choose-address' type='primary' onClick={() => handleHomeAddress()}> Choisir </AntButton>
                    </Link>
                </div>   
            </Col>
    } else {
        homeAddressElement = null;
    };

    if(props.userSecondaryAddress && props.userSecondaryAddress.address) {
        secondaryAddressElement = 
            <Col> 
                <div className='container-item-address'>
                    <h5> Adresse Secondaire </h5>
                    <div className='address-info'>
                        <p> Adresse : {props.userSecondaryAddress.address}</p>
                        <p> Ville : {props.userSecondaryAddress.city}</p>
                        <p> Code Postal : {props.userSecondaryAddress.zipCode}</p>
                    </div> 
                    <Link to='/PaymentConfirm'>
                        <AntButton className='button-choose-address' type='primary' onClick={() => handleSecondaryAddress()}> Choisir </AntButton>
                    </Link>
                </div>
            </Col>
    } else {
        secondaryAddressElement = null
    }

    
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
                                {homeAddressElement}
                                {secondaryAddressElement}
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
                            <Checkbox className='checkbox-address' onChange={onChange}>Enregistrer cette adresse</Checkbox>
                            <Link to='/PaymentConfirm'>
                                <Button color="info" className='float-right buton-form-address' onClick={() => confirmAddress()}> Valider votre adresse </Button>
                            </Link>  
                        </div>
                    </Col>
                    
                    <Col lg={{size: 4, offset:0}} xs={{size: 8, offset: 2}} md={{size: 6, offset: 3}} className='mt-lg-0 mt-md-5 mt-sm-5'>
                    <div className='container-total'>
                            <div className='total'>
                                <div className='product-total'>
                                    Produits  
                                    <span className='amount'> {props.OrderProductsPrice} € </span>
                                </div>
                                <div className='delivery-total'>
                                    Livraison  
                                    <span className='amount'> {props.OrderDeliveryPrice} € </span>
                                </div>
                                <hr />
                                <div className='order-total'>
                                    Total  
                                    <span className='amount'> {props.totalOrder} € </span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                </Col> 
            </Row>
            <Footer />
        </Container>
    );
}


function mapStateToProps(state) {
    //Récupere les données depuis le reducer
    console.log('MY state', state)
    return {
        userToken: state.User.token,
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
        addAddress: function(address, city, zipCode) {
            dispatch({
                type: 'addAddress',
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
        }
    }
}


export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AddressForm)