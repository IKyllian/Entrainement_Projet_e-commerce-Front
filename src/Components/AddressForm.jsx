import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Input } from 'antd';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {adressIp} from '../config';

import Header from './Header';
import Footer from './Footer';
import ProgressOrder from './ProgressOrder' 

function AddressForm(props) {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    console.log('AZEAZEAZEAZEAZEAZE', props.userToken)
    var confirmAddress = () => {
        //if(address ==! ' ' || city ==! ' ' || zipCode ==! ' ') {
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
                props.addAddress(datas.result.fullAddress.address, datas.result.fullAddress.city, datas.result.fullAddress.zipCode)
            })
            .catch(function(err) {
                console.log(err);
            })
        //}
    }

    return(
        <Container>
            <Header />
            <Row>
                <Col  md={{size: 10, offset:1 }} style={{minHeight: '65vh', marginTop: '2em', marginBottom: '3em'}}>
                <ProgressOrder  /> 
                <Row md='2'>
                    <Col md='8'>
                        <div className='container-form-address'>
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
                            <Link to='/PaymentConfirm'>
                                <Button color="info" className='float-right buton-form-address' onClick={() => confirmAddress()}> Valider votre adresse </Button>
                            </Link>  
                        </div>
                    </Col>
                    
                    <Col md='4'>
                    <div className='container-total'>
                            <div className='total'>
                                <div className='product-total'>
                                    Produits  
                                    <span className='amount'> 123 € </span>
                                </div>
                                <div className='delivery-total'>
                                    Livraison  
                                    <span className='amount'> 123 € </span>
                                </div>
                                <hr />
                                <div className='order-total'>
                                    Total  
                                    <span className='amount'> 123 € </span>
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
        userAddress: state.User.fullAddress,
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
        }
    }
}


export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AddressForm)