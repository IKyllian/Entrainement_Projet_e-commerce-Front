import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Input, Form, Button, Divider, message } from 'antd';

import Header from './Menu/Header';
import Footer from './Menu/Footer';
import {adressIp} from '../config';

const { TextArea } = Input;

function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sujet, setSujet] = useState('');
    const [messageForm, setMessageForm] = useState('');

    const [statusName, setStatusName] = useState('');
    const [statusEmail, setStatusEmail] = useState('');
    const [statusSujet, setStatusSujet] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const success = () => {
        message.success('Votre message a bien été envoyer !');
      };

      const error = () => {
        message.error('Votre message n\'a pas pu être envoyer :(');
      };

    const handleClick = () => {
        if(name === '' || email === '' || sujet === '' || messageForm === '') {
            name === '' ? setStatusName('error') : setStatusName('success');
            email === '' ? setStatusEmail('error') : setStatusEmail('success');
            sujet === '' ? setStatusSujet('error') : setStatusSujet('success');
            messageForm === '' ? setStatusMessage('error') : setStatusMessage('success');
        } else {
            var datasBody = JSON.stringify({
                name: name,
                email: email,
                sujet: sujet,
                message: messageForm
            })

            fetch(`http://${adressIp}:3000/sendContactMessage`,
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
                    console.log(datas)
                   if(datas) {
                       console.log(datas.response)
                       datas.response ? success() : error();
                       setName('');
                       setEmail('');
                       setSujet('');
                       setMessageForm('');
                       setStatusName('');
                       setStatusEmail('')
                       setStatusSujet('')
                       setStatusMessage('')
                   } else {
                    error()
                   }
                })
                .catch(function(err) {
                    console.log(err);
                })
        }
    }
    return(
         <Container fluid={true}>
            <Header />
            <Row className='container-form-contact'>
                <Col xs={{size: 8, offset: 2}} >
                    <div className='mx-md-5'>
                        <h3> Contactez-nous </h3>
                        <Divider className='divider-contact'/>
                        <p> Pour toute remarque, question, suggestion n'hésitez pas à nous contacter </p>
                        <Form>
                            <Form.Item className='mb-1' validateStatus={statusName} hasFeedback >
                                <Input placeholder='Nom - Prenom' value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Item>
                            <Form.Item className='mb-2' validateStatus={statusEmail} hasFeedback>
                                <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Item>
                            <Form.Item className='mb-2' validateStatus={statusSujet} hasFeedback>
                                <Input placeholder='Sujet' value={sujet} onChange={(e) => setSujet(e.target.value)} />
                            </Form.Item>
                            <Form.Item className='mb-1' validateStatus={statusMessage} hasFeedback>
                                <TextArea placeholder='Message' rows={4}  value={messageForm} onChange={(e) => setMessageForm(e.target.value)} />
                            </Form.Item>
                            <Button type='primary' onClick={() => handleClick()}> Envoyer </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
                <Footer />            
         </Container>
    );
}

export default ContactForm