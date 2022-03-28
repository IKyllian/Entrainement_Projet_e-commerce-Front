import React, {useState} from 'react'
import { Container, Row, Col } from 'reactstrap';
import { Input, Checkbox, Button, Form, notification} from 'antd';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import {connect} from 'react-redux';
import {Redirect, Link } from 'react-router-dom'

import {adressIp} from '../../config';
import NavHeader from '../Menu/NavHeader';

function SignUp(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkboxForm, setCheckboxForm] = useState(false)

    const [statusEmail, setStatusEmail] = useState('')
    const [errorMessageEmail, setErrorMessageEmail] = useState('')
    const [statusFirstName, setStatusFirstName] = useState('')
   // const [errorMessageFirstName, setErrorMessageFirstName] = useState('')
    const [statusLastName, setStatusLastName] = useState('')
   // const [errorMessageLastName, setErrorMessageLastName] = useState('')
    const [statusPassword, setStatusPassword] = useState('')

    const { linkFrom } = props.location.state ? props.location.state : 'direct_link';

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            'Un problème est survenu lors de la création de votre compte, veuillez réessayer plus tard si le problème persiste'
        });
    };

    //Permet d'envoyer les infos en back et de crée le compte en base de donnée
    var handleSignup = () => {
        //check si les inputs sont remplis
        if(firstName === '' || lastName === '' || email === '' || password === ''){
            //Si non, display les erreurs sur les inputs vides 
            firstName === '' ? setStatusFirstName('error') : setStatusFirstName('success')
            lastName === '' ? setStatusLastName('error') : setStatusLastName('success')
            email === '' ? setStatusEmail('error') : setStatusEmail('success')
            password === '' ? setStatusPassword('error') : setStatusPassword('success')   
        } else {
            var datasBody = JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email.toLowerCase(),
                password: password,
                stayConnected : checkboxForm
            })
            fetch(`http://${adressIp}:3000/users/signup`,
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: datasBody
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                //Reponse du backend qui permet de savoir si la création du compte a réussi
                if(data.validLog) {
                    if(data.result) {
                        //Envoie les données vers mapDispatchToProps pour envoyer au reducer
                        props.userConnected(true);
                        props.signUp(data.result.token, data.result.first_name, data.result.last_name, data.result.email, data.result.role, data.result.panier, data.background_profil, data.sold_points, data.discount_codes);
                        props.changeUserStatus(true);
                    } else {
                        openNotificationWithIcon('error')
                    }  
                } else {
                    //Display les erreurs les erreurs 
                    setStatusEmail('error');
                    setErrorMessageEmail('Cet email est déjà utilisé')
                    setPassword('')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        }
    }

    function onChange(e) {
        setCheckboxForm(e.target.checked)
    }

    const onChangeFirstName = (e) => {
        setFirstName(e.target.value);
    }
    
    var socialButton = {
        height: '2.4em',
    }
    //Permet de rediriger vers la home quand le user est connecté
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
                                        <h3 style={{marginBottom: '1em'}}> Se Créer Un Compte </h3>
                                        <Form>
                                            <Form.Item validateStatus={statusFirstName} hasFeedback>
                                                <Input className='style-input' placeholder= 'Nom' value={firstName} onChange={(e) => onChangeFirstName(e)} />
                                            </Form.Item>
                                            <Form.Item validateStatus={statusLastName}  hasFeedback>
                                                <Input className='style-input' placeholder= 'Prenom' value={lastName} onChange={(e) => setLastName(e.target.value) } />
                                            </Form.Item>
                                            <Form.Item validateStatus={statusEmail} help={errorMessageEmail} hasFeedback>
                                                <Input className='style-input' placeholder= 'Email' value={email} onChange={(e) => setEmail(e.target.value) } />
                                            </Form.Item>
                                            <Form.Item validateStatus={statusPassword} hasFeedback>
                                                <Input className='style-input' type='password' placeholder= 'Password' value={password} onChange={(e) => setPassword(e.target.value) } />
                                            </Form.Item>
                                            <Checkbox className='checkbox-sign' onChange={onChange}>Rester connecté </Checkbox>
                                            <Button style= {{width: '80%'}} onClick={() => handleSignup()} type='primary'> Créer un compte </Button>
                                        </Form>
                                        <Link to='/Signin'>
                                            <p className='mt-2 text-center' style={{marginRight: '5.5em'}}> Déjà inscrit ? Connectez-vous </p>
                                        </Link>
                                    </div>
                                    {/* <div style={{width: '2px', height: '100%', backgroundColor: 'pink'}}> </div> */}
        
                                </Col>
                                <Col>
                                <h3> Se créer un compte avec :</h3>
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
    return {
        userIsConnected: state.UserConnected,
    }
}

function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        signUp: function(token, firstName, lastName, email, role, panier, background_profil, soldPoints, discountCodes) {
            dispatch({
                type: 'sign',
                token: token,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                panier: panier,
                homeAddress: {
                    address: null,
                    city : null,
                    zipCode : null
                },
                secondaryAddress: {
                    address: null,
                    city : null,
                    zipCode : null
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
)(SignUp)