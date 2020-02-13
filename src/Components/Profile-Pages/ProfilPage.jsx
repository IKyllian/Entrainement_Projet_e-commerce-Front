import React, { useState, useEffect } from 'react';
import { Container, Row, Col} from 'reactstrap';
import {connect} from 'react-redux';

import Header from '../Header';
import ProfilPageMenu from './NavMenu';
import CardAddressUser from './AddressCard';
import DescriptionsUserItem from './DescUserItem'
import { Redirect } from 'react-router-dom';

function ProfilPage(props) {
    const [isConnected, setIsConnected] = useState(props.isConnected);

    useEffect(() => {
        setIsConnected(props.isConnected)
    }, [props.isConnected])


    if(!props.isConnected) {
        return (
            <Redirect to='/' />
        )
    } else {
        return (
            <Container fluid={true}>
                <Header />
                <Row md='2' sm='1' className='container-row-profil'>
                    <Col md={{size: 3 ,offset: 2}} sm={{size: 10, offset: 1}}>
                        <ProfilPageMenu item='1' />
                    </Col>
                    <Col>
                        <h3 className='text-center'>Vos informations </h3>
                        <div className='container-user-info'>
                            <Row md='2' xs='2'>
                                <Col md={{size: 6, offset: 0}} xs={{size: 5, offset: 1}}>
                                    <DescriptionsUserItem label='Nom' content={props.userFirstName} fontSize={17} />
                                </Col>
                                <Col md={{size: 6, offset: 0}} xs={{size: 5, offset: 1}}>
                                    <DescriptionsUserItem label='Prenom' content={props.userLastName} fontSize={17} />
                                </Col>
                                <Col md={{size: 12, offset: 0}} xs={{size: 11, offset: 0}}>
                                    <DescriptionsUserItem label='Email' content={props.userEmail} fontSize={17} />
                                </Col>
                            </Row>
                        </div>
                        <div className='container-user-address'>
                            <h4> Vos adresses enregistées</h4>
                            <Row sm='1'>
                                <CardAddressUser  objectAddress={props.userHomeAddress} addressNumber={1} />
                                <CardAddressUser  objectAddress={props.userSecondaryAddress} addressNumber={2} />
                            </Row>     
                        </div> 
                    </Col>
                </Row>
    
            </Container>
        );
    }
    
}


function mapStateToProps(state) {
    return {
        isConnected : state.UserConnected,
        userFirstName : state.User.firstName,
        userLastName : state.User.lastName,
        userEmail : state.User.email,
        userHomeAddress : state.User.homeAddress,
        userSecondaryAddress : state.User.secondaryAddress
    }
}

export default connect(
    mapStateToProps, 
    null
)(ProfilPage)
