import React, {useState} from 'react'
import { Container, Row, Col } from 'reactstrap';
import { Input, Checkbox, Button, Form} from 'antd';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import {connect} from 'react-redux';
import {Redirect, Link } from 'react-router-dom'

import {adressIp} from '../../config';


function SignUp(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkboxForm, setCheckboxForm] = useState(false)

    const [statusEmail, setStatusEmail] = useState('')
    const [errorMessageEmail, setErrorMessageEmail] = useState('')
    const [statusFirstName, setStatusFirstName] = useState('')
    const [errorMessageFirstName, setErrorMessageFirstName] = useState('')
    const [statusLastName, setStatusLastName] = useState('')
    const [errorMessageLastName, setErrorMessageLastName] = useState('')
    const [statusPassword, setStatusPassword] = useState('')


    //Permet d'envoyer les infos en back et de crée le compte en base de donnée
    var handleSignup = () => {

        if(firstName === '' || lastName === '' || email === '' || password === ''){
            firstName === '' ? setStatusFirstName('error') : setStatusFirstName('success')
            lastName === '' ? setStatusLastName('error') : setStatusLastName('success')
            email === '' ? setStatusEmail('error') : setStatusEmail('success')
            password === '' ? setStatusPassword('error') : setStatusPassword('success')

           
        } else {
            var datasBody = JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
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
                    console.log(data);
                    //Envoie les données vers mapDispatchToProps pour envoyer au reducer
                    props.signUp(data.result.token, data.result.first_name, data.result.last_name, data.result.email, data.result.role, data.result.panier);
                    props.userConnected(true)
                } else {
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

    var styleInput = {
        width: '80%',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none'
    }

    var socialButton = {
        height: '2.4em',
    }
    //Permet de rediriger vers la home quand le user est connecté
    if(props.userIsConnected) {
        return (
            <Redirect to='/' />
        );
    } else {
        return (
            <Container style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Row style={{height: '50%', width: '80%'}}>
                    <Col md={{size: 11, offset: 1}}>
                        <Row md='2'>
                            <Col>
                                <div style={{ display: 'flex', flexDirection: 'column'}}>   
                                    <h3 style={{marginBottom: '1em'}}> Se Créer Un Compte </h3>
                                    <Form>
                                        <Form.Item validateStatus={statusFirstName} help={errorMessageFirstName} hasFeedback>
                                            <Input className='input' style={styleInput} placeholder= 'Nom' value={firstName} onChange={(e) => onChangeFirstName(e)} />
                                        </Form.Item>
                                        <Form.Item validateStatus={statusLastName} help={errorMessageLastName} hasFeedback>
                                            <Input className='input' style={styleInput} placeholder= 'Prenom' value={lastName} onChange={(e) => setLastName(e.target.value) } />
                                        </Form.Item>
                                        <Form.Item validateStatus={statusEmail} help={errorMessageEmail} hasFeedback>
                                            <Input className='input' style={styleInput} placeholder= 'Email' value={email} onChange={(e) => setEmail(e.target.value) } />
                                        </Form.Item>
                                        <Form.Item validateStatus={statusPassword} hasFeedback>
                                            <Input className='input' type='password' style={styleInput} placeholder= 'Password' value={password} onChange={(e) => setPassword(e.target.value) } />
                                        </Form.Item>
                                        <Checkbox className='checkbox-sign' onChange={onChange}>Rester connecté </Checkbox>
                                        <Button style= {{width: '80%'}} onClick={() => handleSignup()} type='primary'> Créer un compte </Button>
                                    </Form>
                                    <Link to='/Signin'>
                                        <p className='mt-2 text-center' style={{marginRight: '5.5em'}}> Pas de compte ? Inscrivez-vous </p>
                                    </Link>
                                 </div>
                                 {/* <div style={{width: '2px', height: '100%', backgroundColor: 'pink'}}> </div> */}
    
                            </Col>
                            <Col>
                            <h3> Se Créer Un Compte Avec :</h3>
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
        userIsConnected: state.UserConnected,
    }
}

function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        signUp: function(token, firstName, lastName, email, role, panier) {
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
)(SignUp)