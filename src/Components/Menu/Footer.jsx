import React, { useState } from 'react'
import { Input, Breadcrumb, Form, message } from 'antd';
import { Row, Col } from 'reactstrap';
import { SocialIcon } from 'react-social-icons';

import {adressIp} from '../../config';

const { Search } = Input;

function Footer() {
    const [emailNewsletter, setEmailNewsletter] = useState('');
    const [statusEmail, setStatusEmail] = useState('');

    const success = () => {
        message.success('Votre email a bien été enregisté');
    };
      
    const error = (email) => {
        message.error(email ? 'Cet email est déjà enregistré' : 'Une erreur s\'est produite');
    };

    const errorEmpty = () => {
        message.error('Vous devez renseigner votre email pour vous inscrire');
    };

    const registerToNewsLetter = () => {
        if(emailNewsletter === '') {
            setStatusEmail('error');
            errorEmpty();
        } else {
            var datasBody = JSON.stringify({
               email: emailNewsletter
            })
            fetch(`http://${adressIp}:3000/newsletterRegister`,
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
                if(data) {
                    if(data.register) {
                        success();
                    } else {
                        data.errorEmail ? error(true) : error(false)
                    }
                }
                setEmailNewsletter('');
                setStatusEmail('')
            })
            .catch(function(err) {
                console.log(err);
            })
        }
    }
    return (
        <footer style={{minHeight: '160px', backgroundColor: '#1b2a49'}}>
                <div className='container-footer'>
                    <h4 className='text-center text-white'> Inscrivez-vous pour recevoir des offres spéciales et des mises a jour </h4>
                    <Row className='text-center container-button-footer'>
                        <Col md={{size: 6, offset: 3}}>
                            <Form.Item validateStatus={statusEmail}>
                                <Search
                                    placeholder="Entrez votre adresse mail"
                                    enterButton="S'inscrire"
                                    size="large"
                                    value={emailNewsletter}
                                    onChange={(e) => setEmailNewsletter(e.target.value)}
                                    onSearch={() => registerToNewsLetter()}
                                />
                            </Form.Item>
                           
                        </Col>
                    </Row>
                    <div className='container-breadcrumb'>
                        <Breadcrumb className= 'text-center text-white'>
                            <Breadcrumb.Item>Tous droits réservés</Breadcrumb.Item>
                            <Breadcrumb.Item> Conditions d'utilisations </Breadcrumb.Item>
                            <Breadcrumb.Item> Confidentialité </Breadcrumb.Item>
                            <Breadcrumb.Item>Droit d'auteur</Breadcrumb.Item>
                            <Breadcrumb.Item className='text-white'> Connexion</Breadcrumb.Item>

                        </Breadcrumb>
                    </div>
                    <Row>
                        <Col className='text-center'>
                            <div className='container-social-icon'>
                                <SocialIcon style={{width: 40, height: 40, marginRight: 10}} fgColor="#ffff" url="http://twitter.com" />
                                <SocialIcon style={{width: 40, height: 40, marginRight: 10}} fgColor="#ffff" url="http://instagram.com" />
                                <SocialIcon style={{width: 40, height: 40, marginRight: 10}} fgColor="#ffff" url="http://facebook.com" />
                                <SocialIcon style={{width: 40, height: 40, marginRight: 10}} fgColor="#ffff" url="http://pinterest.com" />
                            </div>
                            
                        </Col>
                        
                    </Row>
                </div>
        </footer>
    );
}


export default Footer