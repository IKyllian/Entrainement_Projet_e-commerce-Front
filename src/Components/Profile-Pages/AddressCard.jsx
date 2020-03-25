import React, {useState, useEffect} from 'react';
import { Row, Col} from 'reactstrap';
import {connect} from 'react-redux';
import { Menu, Icon, Popconfirm, Button, Modal, Input, Form, notification} from 'antd';

import DescriptionsUserItem from './DescUserItem'
import {adressIp} from '../../config';

function CardAddressUser(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);

    const [inputNameAddress, setInputNameAddress] = useState('');
    const [inputAddress, setInputAddress] = useState('');
    const [inputAdditionalAddress, setInputAdditionalAddress] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [inputZipCode, setInputZipCode] = useState('');

    const [inputNameAddressEdit, setInputNameAddressEdit] = useState('');
    const [inputAddressEdit, setInputAddressEdit] = useState('');
    const [inputAdditionalAddressEdit, setInputAdditionalAddressEdit] = useState('');
    const [inputCityEdit, setInputCityEdit] = useState('');
    const [inputZipCodeEdit, setInputZipCodeEdit] = useState('');

    const [statusNameAddress, setStatusNameAddress] = useState('');
    const [statusAddress, setStatusAddress] = useState('');
    const [statusCity, setStatusCity] = useState('');
    const [statusZipCode, setStatusZipCode] = useState('');

    const openNotificationWithIcon = (type, action) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            `Votre adresse n\a pas pu être ${action === 'edit' ? 'edité' : 'supprimer'} ${action === 'editErrInput' ? '.Problème liée a un champ de saisi' : ', veuillez réesayer plus tard si cela persiste'}`,
        });
    };
    const openNotificationAddWithIcon = (type) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            `Votre adresse n\a pas pu être ajoutée, veuillez réesayer plus tard si cela persiste'}`,
        });
    };

    //Mettre les bonnes valeurs en fonction de l'adresse choisit
    useEffect(() => {
        if(props.addressNumber === 1 && props.userHomeAddress) {
            setInputNameAddressEdit(props.userHomeAddress.name);
            setInputAddressEdit(props.userHomeAddress.address);
            setInputAdditionalAddressEdit(props.userHomeAddress.additionalAddress);
            setInputCityEdit(props.userHomeAddress.city);
            setInputZipCodeEdit(props.userHomeAddress.zipCode);
        } else if(props.addressNumber === 2 && props.userSecondaryAddress) {
            setInputNameAddressEdit(props.userSecondaryAddress.name);
            setInputAddressEdit(props.userSecondaryAddress.address);
            setInputAdditionalAddressEdit(props.userSecondaryAddress.additionalAddress);
            setInputCityEdit(props.userSecondaryAddress.city);
            setInputZipCodeEdit(props.userSecondaryAddress.zipCode);
        }
    },[props.userHomeAddress, props.userSecondaryAddress, props.addressNumber])

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
            if(datas.result) {
                if(props.addressNumber === 1) {
                    props.addHomeAddress(null, null, null, null, null);
                } else {
                    props.addSecondaryAddress(null, null, null, null, null);
                }
            } else {
                openNotificationWithIcon('error', 'delete');
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    //Permet de crée une adresse
    const handleOk = async () => {
        if(inputNameAddress === '' || inputAddress === '' || inputCity === '' || inputZipCode === '') {
            inputNameAddress === '' ? setStatusNameAddress('error') : setStatusNameAddress('success');
            inputAddress === '' ? setStatusAddress('error') : setStatusAddress('success');
            inputCity === '' ? setStatusCity('error') : setStatusCity('success');
            inputZipCode === '' ? setStatusZipCode('error') : setStatusZipCode('success');
        } else {
            var datasBody = JSON.stringify({
                userToken : props.userToken,
                name: inputNameAddress,
                address : inputAddress,
                additionalAddress: inputAdditionalAddress,
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
                if(!datas.errAdd) {
                    if(datas.addHomeAddress) {
                        props.addHomeAddress(datas.result.homeAddress.name, datas.result.homeAddress.address, datas.result.homeAddress.additional_address, datas.result.homeAddress.city, datas.result.homeAddress.zipCode);
                    } else {
                        props.addSecondaryAddress(datas.result.secondaryAddress.name, datas.result.secondaryAddress.address, datas.result.secondaryAddress.additional_address, datas.result.secondaryAddress.city, datas.result.secondaryAddress.zipCode);
                    }
                    setInputNameAddress('')
                    setInputAddress('');
                    setInputAdditionalAddress('');
                    setInputCity('');
                    setInputZipCode('');
                    
                    setStatusNameAddress('');
                    setStatusAddress('');
                    setStatusCity('');
                    setStatusZipCode('');
    
                    setModalVisible(false);
                } else {
                    openNotificationAddWithIcon('error');
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        }
    }

    const handleOkEdit = () => {
        if(inputNameAddressEdit === '' || inputAddressEdit === '' || inputCityEdit === '' || inputZipCodeEdit === '') {
            inputNameAddressEdit === '' ? setStatusNameAddress('error') : setStatusNameAddress('success');
            inputAddressEdit === '' ? setStatusAddress('error') : setStatusAddress('success');
            inputCityEdit === '' ? setStatusCity('error') : setStatusCity('success');
            inputZipCodeEdit === '' ? setStatusZipCode('error') : setStatusZipCode('success');
        } else {
            var datasBody = JSON.stringify({
                userToken : props.userToken,
                name: inputNameAddressEdit,
                address : inputAddressEdit,
                additionalAddress: inputAdditionalAddressEdit,
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
                if(datas.result) {
                    if(props.addressNumber === 1) {
                        props.addHomeAddress(inputNameAddressEdit, inputAddressEdit, inputAdditionalAddressEdit, inputCityEdit, inputZipCodeEdit);
                    } else {
                        props.addSecondaryAddress(inputNameAddressEdit, inputAddressEdit, inputAdditionalAddressEdit, inputCityEdit, inputZipCodeEdit);
                    }
                    setStatusNameAddress('')
                    setStatusAddress('');
                    setStatusCity('');
                    setStatusZipCode('');
                    setModalEditVisible(false);
                } else {
                    if(datas.errInput) {
                        openNotificationWithIcon('error', 'editErrInput');
                    } else {
                        openNotificationWithIcon('error', 'edit');
                    }
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        }
        
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
                                    <DescriptionsUserItem label='Nom Adresse' content={props.objectAddress.name} fontSize={14} />
                                </Col>
                                <Col sm={{size: 12, offset: 0}}>
                                    <DescriptionsUserItem label='Adresse' content={props.objectAddress.address} fontSize={14} />
                                </Col>
                                {
                                    props.objectAddress.additionalAddress && props.objectAddress.additionalAddress !== '' &&
                                    <Col sm={{size: 12, offset: 0}}>
                                        <DescriptionsUserItem label={'Complément d\'adresse'} content={props.objectAddress.additionalAddress} fontSize={14} />
                                    </Col>
                                }
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
                                <Form.Item validateStatus={statusNameAddress} hasFeedback>
                                    <Input value={inputNameAddressEdit} onChange={(e) => setInputNameAddressEdit(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col sm={{size: 10, offset:0}} className='mb-3'>
                                <Form.Item validateStatus={statusAddress} hasFeedback>
                                    <Input value={inputAddressEdit} onChange={(e) => setInputAddressEdit(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col sm={{size: 10, offset:0}} className='mb-3'>
                                <Form.Item>
                                    <Input value={inputAdditionalAddressEdit} onChange={(e) => setInputAdditionalAddressEdit(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col sm='6'>
                                <Form.Item validateStatus={statusCity} hasFeedback>
                                    <Input value={inputCityEdit} onChange={(e) => setInputCityEdit(e.target.value)} /> 
                                </Form.Item>
                            </Col>
                            <Col sm='6'>
                                <Form.Item  validateStatus={statusZipCode} hasFeedback>
                                    <Input value={inputZipCodeEdit} onChange={(e) => setInputZipCodeEdit(e.target.value)} /> 
                                </Form.Item>
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
                                <Form.Item validateStatus={statusNameAddress} hasFeedback>
                                    <Input placeholder='Nom' value={inputNameAddress} onChange={(e) => setInputNameAddress(e.target.value)} /> 
                                </Form.Item>
                            </Col>
                            <Col sm={{size: 10, offset:0}} className='mb-3'>
                                <Form.Item validateStatus={statusAddress} hasFeedback>
                                    <Input placeholder='Adresse' value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} /> 
                                </Form.Item>
                            </Col>
                            <Col sm={{size: 10, offset:0}} className='mb-3'>
                                <Form.Item>
                                    <Input placeholder={'Complément d\'adresse (Facultatif)'} value={inputAdditionalAddress} onChange={(e) => setInputAdditionalAddress(e.target.value)} /> 
                                </Form.Item>
                            </Col>
                            <Col sm='6'>
                                <Form.Item validateStatus={statusCity} hasFeedback>
                                    <Input placeholder='Ville' value={inputCity} onChange={(e) => setInputCity(e.target.value)} /> 
                                </Form.Item>
                            </Col>
                            <Col sm='6'>
                                <Form.Item  validateStatus={statusZipCode} hasFeedback>
                                    <Input placeholder='Zip Code' value={inputZipCode} onChange={(e) => setInputZipCode(e.target.value)} /> 
                                </Form.Item>
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
        addHomeAddress: function(name, address, additionalAddress, city, zipCode) {
            dispatch({
                type: 'addHomeAddress',
                fullAddress: {
                    name: name,
                    address : address,
                    additionalAddress: additionalAddress,
                    city : city,
                    zipCode : zipCode
                }
            })
        },
        addSecondaryAddress: function(name, address, additionalAddress, city, zipCode) {
            dispatch({
                type: 'addSecondaryAddress',
                fullAddress: {
                    name: name,
                    address : address,
                    additionalAddress: additionalAddress,
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