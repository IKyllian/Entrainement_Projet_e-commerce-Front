import React, { useState } from 'react'
import { Container, Row, Col,  } from 'reactstrap';
import { Input, Checkbox, Button, Form } from 'antd';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { connect} from 'react-redux';
import { Redirect, Link } from 'react-router-dom'

import {adressIp} from '../../config';
import NavHeader from '../Menu/NavHeader';

function SignIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkboxForm, setCheckboxForm] = useState(false)
    const [statusEmail, setStatusEmail] = useState('');
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [statusPassword, setStatusPassword] = useState('');

    const { linkFrom } = props.location.state ? props.location.state : 'direct_link';

    //Permet d'envoyer les infos user en back et renvoie une reponse
    var handleSignIn = () => {
        fetch(`http://${adressIp}:3000/users/signin?email=${email.toLowerCase()}&password=${password}&stayConnected=${checkboxForm}`,
        {
            withCredentials: true,
            credentials: 'include',
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(datas) {
            //Reponse du backend qui permet de savoir si la connexion a réussi
            if(datas.userExist) {
                props.userConnected(true)
                if(datas.user.homeAddress && datas.user.secondaryAddress) {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
                } else if(datas.user.homeAddress && !datas.user.secondaryAddress) {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, null, null, null, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
                } else if(!datas.user.homeAddress && datas.user.secondaryAddress) {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, null, null, null, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
                } else {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, null, null, null, null, null, null, datas.user.background_profil, datas.user.sold_points, datas.user.discount_codes);
                }
                props.changeUserStatus(true);
            } else {
                if(datas.inputError === 'email') {
                    setStatusEmail('error');
                    setErrorMessageEmail('Cet email n\'éxiste pas');
                    setPassword('');
                } else if(datas.inputError === 'password') {
                    setStatusEmail('success');
                    setStatusPassword('error');
                    setPassword('');
                }
            }

        })
        .catch(function(err) {
            console.log(err);
        })
    }

    function onChange(e) {
        setCheckboxForm(e.target.checked)
    }

    var socialButton = {
        height: '2.4em',
    }

    if(props.userIsConnected && linkFrom !== 'panier') {
        return (
            <Redirect to='/' />
        );
    } else if(props.userIsConnected && linkFrom === 'panier') {
        return (
            <Redirect to='/Panier' />
        );
    } else {
        return (
            <Container fluid={true}>
                <div className='nav-sign'>
                    <NavHeader />
                </div>
                <div className='container-sign'>
                    <Row style={{height: '50%', width: '80%'}}>
                        <Col md={{size: 11, offset: 1}}>
                            <Row md='2' xs='1'>
                                <Col>
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                        <h3 style={{marginBottom: '1em'}}> Se Connecter </h3>
                                        <Form>
                                            <Form.Item validateStatus={statusEmail} hasFeedback help={errorMessageEmail}>
                                                <Input className='style-input' placeholder= 'Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </Form.Item>
                                            <Form.Item validateStatus={statusPassword} hasFeedback>
                                                <Input className='style-input' type='password' placeholder= 'Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                            </Form.Item>
                                            <Checkbox className='checkbox-sign' onChange={onChange}>Rester connecté </Checkbox>
                                            <Button style= {{width: '80%'}} onClick={() => handleSignIn()} type='primary'> Connexion </Button>
                                        </Form>
                                        
                                        <Link to='/Signup'>
                                            <p className='mt-2 text-center' style={{marginRight: '5.5em'}}> Pas de compte ? Inscrivez-vous </p>
                                        </Link>
                                    </div>
                                    {/* <div style={{width: '2px', height: '100%', backgroundColor: 'pink'}}> </div> */}
        
                                </Col>
                                <Col>
                                <h3> Se connecter avec :</h3>
                                    <div style={{display: 'flex', flexDirection: 'column', marginTop: '2em'}}>
                                            <FacebookLoginButton style={socialButton}  />
                                            <GoogleLoginButton style={socialButton} />                        
                                    </div>
                                </Col>  
                            </Row>
                        </Col>
                    </Row>
                </div>

            </Container>
        );
    }
    
}

function mapStateToProps(state) {
    //Récupere les données depuis le reducer
    return {
        userIsConnected: state.UserConnected
    }
}

function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        signIn: function(token, firstName, lastName, email, role, panier, address_H, city_H, zipCode_H, address_S, city_S, zipCode_S, background_profil, soldPoints, discountCodes) {
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
                },
                background_profil: background_profil,
                soldPoints : soldPoints,
                discountCodes: discountCodes
            })
        },
        userConnected: function(isConnected) {
            dispatch({
                type: 'changeStatus',
                isConnected: isConnected
            })
        },
        changeUserStatus: function(isLog) {
            dispatch({
                type: 'userIsLog',
                userIsLog: isLog
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(SignIn)