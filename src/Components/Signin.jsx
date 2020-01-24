import React, {useState} from 'react'
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import {adressIp} from '../config';
import {connect} from 'react-redux';
import {Redirect } from 'react-router-dom'
import { Input } from 'antd';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";

function SignIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    var handleSignIn = () => {
        fetch(`http://${adressIp}:3000/users/signin?email=${email}&password=${password}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //Reponse du backend qui permet de savoir si la création du compte a réussi
            if(data.userExist) {
                console.log(data);
                //Envoie les données vers mapDispatchToProps pour envoyer au reducer
                props.signIn(data.userDatas.token, data.userDatas.first_name, data.userDatas.last_name, data.userDatas.email, data.userDatas.role, data.userDatas.panier);
                props.userConnected(true)
            } else {
                console.log('Log not valid');
            }

        })
        .catch(function(err) {
            console.log(err);
        })
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

    if(props.userIsConnected) {
        return (
            <Redirect to='/' />
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
                                    <Input className='input' style={styleInput} placeholder= 'Password' value={password} onChange={(e) => setPassword(e.target.value)} />
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
        signIn: function(token, firstName, lastName, email, role, panier) {
            dispatch({
                type: 'sign',
                token: token,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                panier: panier
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