import React from 'react'
import { Input } from 'antd';
import { Container, Row, Col } from 'reactstrap';
import { Breadcrumb } from 'antd';
import { SocialIcon } from 'react-social-icons';

const { Search } = Input;


function Header() {
    return (
        <footer style={{minHeight: '160px', backgroundColor: '#1b2a49'}}>
            <Container>
                <div className='container-footer'>
                    <h4 className='text-center text-white'> Inscrivez-vous pour recevoir des offres spéciales et des mises a jour </h4>
                    <Row className='text-center container-button-footer'>
                        <Col md={{size: 6, offset: 3}}>
                            <Search
                                placeholder="Entrez votre adresse mail"
                                enterButton="S'inscrire"
                                size="large"
                            />
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
                        <Col md={{size: 4, offset: 4}}>
                            <div className='container-social-icon'>
                                <SocialIcon style={{width: 40, height: 40}} fgColor="#ffff" url="http://twitter.com" />
                                <SocialIcon style={{width: 40, height: 40}} fgColor="#ffff" url="http://instagram.com" />
                                <SocialIcon style={{width: 40, height: 40}} fgColor="#ffff" url="http://facebook.com" />
                                <SocialIcon style={{width: 40, height: 40}} fgColor="#ffff" url="http://pinterest.com" />
                            </div>
                            
                        </Col>
                        
                    </Row>
                </div>
                
            </Container>
            
            
        </footer>
    );
}


export default Header