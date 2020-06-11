import React from 'react';
import { Container, Row, Col} from 'reactstrap';
import { notification, message } from 'antd';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

import Header from '../Menu/Header';
import Footer from '../Menu/Footer'
import ProfilPageMenu from './NavMenu';
import CardAddressUser from './AddressCard';
import DescriptionsUserItem from './DescUserItem';
import ProgressPoints from './ProgressPoints';
import UserCodeComponent from './UserCodeComponent';

import { adressIp } from '../../config';

function ProfilPage(props) {

    const success = () => {
        message.success('Votre code promo à bien été crée');
    };

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            'Votre code n\'a pas pu se générer, veillez réessayer plus tard si le problème persiste',
        });
    };

    const handleGetCode = () => {
        fetch(`http://${adressIp}:3000/createPromoCode?userToken=${props.userToken}`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas && datas.result) {
                props.addPromoCode(datas.result);
                success();
            } else {
                openNotificationWithIcon('error');
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    if(!props.isConnected) {
        return (
            <Redirect to='/' />
        )
    } else {
        return (
            <Container fluid={true}>
                <Header />
                <Row md='2' xs='1' className='container-row-profil'>
                    <Col md={{size: 3 ,offset: 2}} sm={{size: 10, offset: 1}}>
                        <ProfilPageMenu item='1' />
                    </Col>
                    <Col md='7' >
                        <h3 className='text-center'>Vos informations </h3>
                        <div className='container-user-info'>
                            <Row md='2' xs='2'>
                                <Col md={{size: 6, offset: 0}} xs={{size: 5, offset: 1}}>
                                    <DescriptionsUserItem label='Nom' content={props.userFirstName} fontSize={17} />
                                </Col>
                                <Col md={{size: 6, offset: 0}} xs={{size: 5, offset: 1}}>
                                    <DescriptionsUserItem label='Prénom' content={props.userLastName} fontSize={17} />
                                </Col>
                                <Col md={{size: 12, offset: 0}} xs={{size: 11, offset: 1}}>
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
                        <div className='container-user-promo-progress'>
                            <h4> Vos points fidélité </h4>
                            <Row xs='2'>
                                <ProgressPoints userSoldPoints={props.userSoldPoints} _getCode={handleGetCode} />  
                            </Row>
                            <UserCodeComponent userToken={props.userToken} userDiscountCodes={props.userDiscountCode}/>
                        </div> 
                    </Col>
                </Row>
                <Footer />
            </Container>
        );
    }
    
}


function mapStateToProps(state) {
    return {
        userToken : state.User.token,
        isConnected : state.UserConnected,
        userFirstName : state.User.firstName,
        userLastName : state.User.lastName,
        userEmail : state.User.email,
        userHomeAddress : state.User.homeAddress,
        userSecondaryAddress : state.User.secondaryAddress,
        userSoldPoints : state.User.soldPoints,
        userDiscountCode : state.User.discountCodes
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addPromoCode: function(codeId) {
            dispatch({
                type: 'getPromoCode',
                codeId: codeId,
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ProfilPage)
