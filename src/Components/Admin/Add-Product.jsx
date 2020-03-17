import React, { useState } from 'react';
import { Layout, Form, Input, Upload, Button, Icon, InputNumber, Select, message } from 'antd';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

import Menu from './Menu';
import {adressIp} from '../../config';
import NavHeader from './Nav';

const { Content } = Layout; 
const { TextArea } = Input;
const { Option } = Select;

function AddProduct(props) {
    const [img, setImg] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [type, setType] = useState('');

    const [statusImg, setStatusImg] = useState('')
    const [statusName, setStatusName] = useState('')
    const [statusDescription, setStatusDescription] = useState('')
    const [statusPrice, setStatusPrice] = useState('')
    const [statusStock, setStatusStock] = useState('')
    const [statusType, setStatusType] = useState('')

    const success = () => {
        message.success('Le produit a bien été ajouté');
    }

    const error = () => {
        message.error('Le produit n\'a pas été ajouté');
    }

    const handleSubmit = () => {
        if(img === '' || name === '' || description === '' || price === 0 || stock === 0 || type === '') {
            img === '' ? setStatusImg('error') : setStatusImg('success');
            name === '' ? setStatusName('error') : setStatusName('success');
            description === '' ? setStatusDescription('error') : setStatusDescription('success');
            price === 0 ? setStatusPrice('error') : setStatusPrice('success');
            stock === 0 ? setStatusStock('error') : setStatusStock('success');
            type === '' ? setStatusType('error') : setStatusType('success');
        } else {
            var datasBody = JSON.stringify({
                images: img,
                name: name,
                description: description,
                price: price,
                stock: stock,
                type: type
            })
    
            fetch(`http://${adressIp}:3000/admin/addProduct`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: datasBody
            })
                .then(response => {
                    return response.json();
                })
                .then(datas => {
                    if(datas) {
                        datas.result ? success() : error();
                        setImg('');
                        setName('');
                        setDescription('');
                        setPrice(0);
                        setStock(0);
                        setType('');
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    if(props.userRole === 'user' || !props.userRole) {
        return(
            <Redirect to='/' />
        );
    } else {
        return(
            <Layout>
                <NavHeader />
                <Layout fluid='true' className='container-admin' >
                    <Menu keySelected='4' /> 
                    <Content className='container-content'>
                        <h2 className='text-center'> Ajouter un Produit </h2>
                        <Form>
                            <Form.Item label='Ajouter une image'>
                                <Upload>
                                    <Button>
                                    <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item validateStatus={statusImg} hasFeedback>
                                <Input placeholder='Image Url' value={img} onChange={(e) => setImg(e.target.value)} />
                            </Form.Item>
                            <Form.Item label='Nom du produit' validateStatus={statusName} hasFeedback>
                                <Input placeholder='Nom du produit' value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Item>
                            <Form.Item label='Description du produit' validateStatus={statusDescription} hasFeedback>
                                <TextArea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Item>
                            <div className='container-price-stock'>
                                <Form.Item label='Prix (€)' validateStatus={statusPrice} hasFeedback>
                                    <InputNumber size='large' defaultValue={price} value={price} onChange={(e) => setPrice(e)} />
                                </Form.Item>
                                <Form.Item label='Stock' className='input-stock' validateStatus={statusStock} hasFeedback>
                                    <InputNumber size='large' defaultValue={stock} value={stock} onChange={(e) => setStock(e)} />
                                </Form.Item>
                            </div>
                            <Form.Item label='Type du produit' validateStatus={statusType} hasFeedback>
                                <Select placeholder="Sélectionner un type" value={type} onChange={(e) => setType(e)}>
                                    <Option value="crayons de couleur">Crayons de couleur</Option>
                                    <Option value="marqueur">Marqueur</Option>
                                    <Option value="feutre">Feutre</Option>
                                    <Option value="papier">Papier</Option>
                                    <Option value="crayons à papier">Crayons à papier</Option>
                                    <Option value="peinture">Peinture</Option>
                                </Select>
                            </Form.Item>
                            <Button className='button-admin-add-product' type='primary' onClick={() => handleSubmit()}> Ajouter un produit </Button>
                        </Form>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        userRole: state.User.role
    }
}

export default connect(
    mapStateToProps, 
    null
)(AddProduct)