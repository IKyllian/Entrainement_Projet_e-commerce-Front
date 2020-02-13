import React, {useState, useEffect} from 'react';
import { Row, Col} from 'reactstrap';
import {connect} from 'react-redux';
import { Menu, Icon, Popconfirm, Button, Modal, Input } from 'antd';

import DescriptionsUserItem from './DescUserItem'
import {adressIp} from '../../config';

function CardAddressUser(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [inputAddress, setInputAddress] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [inputZipCode, setInputZipCode] = useState('');

    const [inputAddressEdit, setInputAddressEdit] = useState('');
    const [inputCityEdit, setInputCityEdit] = useState('');
    const [inputZipCodeEdit, setInputZipCodeEdit] = useState('');

    //Mettre les bonnes valeurs en fonction de l'adresse choisit
    useEffect(() => {
        if(props.addressNumber === 1 && props.userHomeAddress) {
            setInputAddressEdit(props.userHomeAddress.address);
            setInputCityEdit(props.userHomeAddress.city);
            setInputZipCodeEdit(props.userHomeAddress.zipCode);
        } else if(props.addressNumber === 2 && props.userSecondaryAddress) {
            setInputAddressEdit(props.userSecondaryAddress.address);
            setInputCityEdit(props.userSecondaryAddress.city);
            setInputZipCodeEdit(props.userSecondaryAddress.zipCode);
        }
    },[props.userHomeAddress, props.userSecondaryAddress])

    const showModal = () => setModalVisible(true);
    const handleCancel = () => setModalVisible(false);

    const handleCancelEdit = () => setModalEditVisible(false);
    const showModalEdit = () => setModalEditVisible(true);


    //Permet de supprimer une adresse
    const confirmDelete = () => {
        var datasBody = JSON.stringify({
            userToken : props.userToken,
            addressNumber : props.addressNumber
        })
        fetch(`http://${adressIp}:3000/deleteAddress`, {
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
        .then(response => {
            return response.json();
        })
        .then(datas => {
            console.log(datas)
            if(props.addressNumber === 1) {
                props.addHomeAddress(null, null, null);
            } else {
                props.addSecondaryAddress(null, null, null);
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    //Permet de crée une adresse
    const handleOk = async () => {
        setModalVisible(false);
        var datasBody = JSON.stringify({
            userToken : props.userToken,
            address : inputAddress,
            city : inputCity,
            zipCode : inputZipCode
        })
        fetch(`http://${adressIp}:3000/addAddress`,
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
            if(datas.addHomeAddress) {
                props.addHomeAddress(datas.result.homeAddress.address, datas.result.homeAddress.city, datas.result.homeAddress.zipCode);
            } else {
                props.addSecondaryAddress(datas.result.secondaryAddress.address, datas.result.secondaryAddress.city, datas.result.secondaryAddress.zipCode);
            }
            setInputAddress('');
            setInputCity('');
            setInputZipCode('');
        })
        .catch(function(err) {
            console.log(err);
        })
    }

    const handleOkEdit = () => {
        setModalEditVisible(false);
        var datasBody = JSON.stringify({
            userToken : props.userToken,
            address : inputAddressEdit,
            city : inputCityEdit,
            zipCode : inputZipCodeEdit,
            addressNumber : props.addressNumber
        })
        fetch(`http://${adressIp}:3000/editAddress`,
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
            console.log(datas.result);
            if(datas.result) {
                if(datas.wichAddress && datas.wichAddress === 1) {
                    props.addHomeAddress(datas.result.homeAddress.address, datas.result.homeAddress.city, datas.result.homeAddress.zipCode);
                } else {
                    props.addSecondaryAddress(datas.result.secondaryAddress.address, datas.result.secondaryAddress.city, datas.result.secondaryAddress.zipCode);
                }
            }
        })
        .catch(function(err) {
            console.log(err);
        })
    } 


    if(props.objectAddress && props.objectAddress.address) {
        return (
            <Col md='10' sm='10' >
                <div className='item-user-address'>
                    <Row>
                        <Col md='9' >
                            <h5> Adresse {props.addressNumber === 1 ? 'Domicile' : 'Secondaire'} :  </h5>
                            <Row sm='2' className='row-address'>
                                <Col sm={{size: 12, offset: 0}}>
                                    <DescriptionsUserItem label='Adresse' content={props.objectAddress.address} fontSize={14} />
                                </Col>
                                <Col  md={{size: 5, offset: 0}} xs={{size: 6, offset: 0}}>
                                    <DescriptionsUserItem label='Ville' content={props.objectAddress.city} fontSize={14} />
                                </Col>
                                <Col md={{size: 6, offset: 0}} xs={{size: 6, offset: 0}}>
                                    <DescriptionsUserItem label='Zip Code' content={props.objectAddress.zipCode} fontSize={14} />
                                </Col>
                            </Row>
                        </Col>
                        <Col md='3'>
                        <Menu
                            inlineCollapsed={true}
                            mode='inline'
                            className='menu-address d-sm-none d-md-block'
                            selectable={false}
                        >
                            <Menu.Item key="1" onClick={() => showModalEdit()}>
                                <Icon type="edit" />
                                <span>Modifier</span>
                            </Menu.Item>
                            
                            <Menu.Item key="2">
                                <Popconfirm
                                    title="Voulez-vous vraiment supprimer cette adresse ?"
                                    okText="Oui"
                                    cancelText="Non"
                                    onConfirm={confirmDelete}
                                >
                                <Icon type="delete" />
                                <span>Supprimer</span>
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>

                        {/* !!!!! Menu Responsive !!!!! */}
                        <Menu
                            mode="horizontal"
                            className='d-xs-block d-md-none text-center'
                            selectable={false}
                        >
                            <Menu.Item key="1" onClick={() => showModalEdit()}>
                                <Icon type="edit" />
                                <span>Modifier</span>
                            </Menu.Item>
                            
                            <Menu.Item key="2">
                                <Popconfirm
                                    title="Voulez-vous vraiment supprimer cette adresse ?"
                                    okText="Oui"
                                    cancelText="Non"
                                    onConfirm={confirmDelete}
                                >
                                <Icon type="delete" />
                                <span>Supprimer</span>
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                        </Col>
                    </Row>
                </div>
                <Modal title="Modifier votre adresse" visible={modalEditVisible}  onOk={handleOkEdit} onCancel={handleCancelEdit}>
                        <Row sm='1'>
                            <Col sm={{size: 10, offset:0}} className='mb-3'>
                                <Input value={inputAddressEdit} onChange={(e) => setInputAddressEdit(e.target.value)} /> 
                            </Col>
                            <Col sm='6'>
                                <Input value={inputCityEdit} onChange={(e) => setInputCityEdit(e.target.value)} /> 
                            </Col>
                            <Col sm='6'>
                                <Input value={inputZipCodeEdit} onChange={(e) => setInputZipCodeEdit(e.target.value)} /> 
                            </Col>
                        </Row>
                </Modal>
            </Col>
        );
    } else {
        return (
            <Col sm='12' className='mb-3'>
                <Button onClick={() => showModal()}> Ajouter une adresse {props.addressNumber === 1 ? ' de domicile' : 'secondaire'}</Button>
                    <Modal title="Ajouter une adresse" visible={modalVisible}  onOk={handleOk} onCancel={handleCancel}>
                        <Row sm='1'>
                            <Col sm={{size: 10, offset:0}} className='mb-3'>
                                <Input placeholder='Adresse' value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} /> 
                            </Col>
                            <Col sm='6'>
                                <Input placeholder='Ville' value={inputCity} onChange={(e) => setInputCity(e.target.value)} /> 
                            </Col>
                            <Col sm='6'>
                                <Input placeholder='Zip Code' value={inputZipCode} onChange={(e) => setInputZipCode(e.target.value)} /> 
                            </Col>
                        </Row>
                </Modal>
            </Col>
        );
    }
}

function mapStateToProps(state) {
    return {
        userToken : state.User.token,
        userHomeAddress : state.User.homeAddress,
        userSecondaryAddress : state.User.secondaryAddress
    }
}


function mapDispatchToProps(dispatch) {
    //Dispatch les données recus depuis le backend
    return {
        addHomeAddress: function(address, city, zipCode) {
            dispatch({
                type: 'addHomeAddress',
                fullAddress: {
                    address : address,
                    city : city,
                    zipCode : zipCode
                }
            })
        },
        addSecondaryAddress: function(address, city, zipCode) {
            dispatch({
                type: 'addSecondaryAddress',
                fullAddress: {
                    address : address,
                    city : city,
                    zipCode : zipCode
                }
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CardAddressUser)