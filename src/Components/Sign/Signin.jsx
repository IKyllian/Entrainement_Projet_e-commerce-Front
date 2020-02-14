import React, {useState} from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { Input, Checkbox } from 'antd';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import {connect} from 'react-redux';
import {Redirect } from 'react-router-dom'

import {adressIp} from '../../config';

function SignIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkboxForm, setCheckboxForm] = useState(false)
    const { linkFrom } = props.location.state ? props.location.state : null;

    //Permet d'envoyer les infos user en back et renvoie une reponse
    var handleSignIn = () => {
        fetch(`http://${adressIp}:3000/users/signin?email=${email}&password=${password}&stayConnected=${checkboxForm}`,
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
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode);
                } else if(datas.user.homeAddress && !datas.user.secondaryAddress) {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, datas.user.homeAddress.address, datas.user.homeAddress.city, datas.user.homeAddress.zipCode, null, null, null);
                } else if(!datas.user.homeAddress && datas.user.secondaryAddress) {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, null, null, null, datas.user.secondaryAddress.address, datas.user.secondaryAddress.city, datas.user.secondaryAddress.zipCode);
                } else {
                    props.signIn(datas.user.token, datas.user.first_name, datas.user.last_name, datas.user.email, datas.user.role, datas.user.panier, null, null, null, null, null, null);
                }
            } else {
                console.log('Log not valid');
            }

        })
        .catch(function(err) {
            console.log(err);
        })
    }

    function onChange(e) {
        setCheckboxForm(e.target.checked)
    }

    var styleInput = {
        width: '80%',
        marginBottom: '1em',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none'
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
            <Container style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Row style={{height: '50%', width: '80%'}}>
                    <Col md={{size: 11, offset: 1}}>
                        <Row md='2' xs='1'>
                            <Col>
                                <div style={{ display: 'flex', flexDirection: 'column'}}>
                                    <h3 style={{marginBottom: '1em'}}> Se Connecter </h3>
                                    <Input className='input' style={styleInput} placeholder= 'Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <Input className='input' type='password' style={styleInput} placeholder= 'Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <Checkbox className='checkbox-sign' onChange={onChange}>Rester connecté </Checkbox>
                                    <Button style= {{width: '80%'}} onClick={() => handleSignIn()}> Connexion </Button>
    
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
        signIn: function(token, firstName, lastName, email, role, panier, address_H, city_H, zipCode_H, address_S, city_S, zipCode_S) {
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
                }
            })
        },
        userConnected: function(isConnected) {
            dispatch({
                type: 'changeStatus',
                isConnected: isConnected
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(SignIn)