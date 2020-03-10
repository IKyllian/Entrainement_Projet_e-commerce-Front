import React, { useState } from 'react';
import { Layout, Form, Input, Upload, Button, Icon, InputNumber, Select, message } from 'antd';

import Menu from './Menu';
import {adressIp} from '../../config';
import { useEffect } from 'react';
import NavHeader from './Nav'

const { Sider, Content } = Layout; 
const { TextArea } = Input;
const { Option } = Select;

function EditProduct(props) {
    const [fileList, setFileList] = useState([])
    const [productId, setProductId] = useState()
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
        message.success('Le produit a bien été modifié');
    }

    const error = () => {
        message.error('Le produit n\'a pas été modifié');
    }

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/getProductAdmin?id=${props.match.params.id}`)
        .then(response => {
            return response.json()
        })
        .then(datas => {
            if(datas) {
                setName(datas.result.name);
                setDescription(datas.result.description);
                setPrice(datas.result.price);
                setStock(datas.result.stock);
                setType(datas.result.type);
                setProductId(props.match.params.id)
                var cpy = [...fileList];
                cpy.push({
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: datas.result.images[0],
                })
                setFileList(cpy)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [props.match.params.id])

    const handleSubmit = () => {
        if(name === '' || description === '' || price === 0 || stock === 0 || type === '') {
            // img === '' ? setStatusImg('error') : setStatusImg('success');
            name === '' ? setStatusName('error') : setStatusName('success');
            description === '' ? setStatusDescription('error') : setStatusDescription('success');
            price === 0 ? setStatusPrice('error') : setStatusPrice('success');
            stock === 0 ? setStatusStock('error') : setStatusStock('success');
            type === '' ? setStatusType('error') : setStatusType('success');
        } else {
            var datasBody = JSON.stringify({
                // images: img,
                id: props.match.params.id,
                name: name,
                description: description,
                price: price,
                stock: stock,
                type: type
            })
    
            fetch(`http://${adressIp}:3000/admin/editProduct`, {
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
                        setName(datas.product.name);
                        setDescription(datas.product.description);
                        setPrice(datas.product.price);
                        setStock(datas.product.stock);
                        setType(datas.product.type);

                        setStatusName('');
                        setStatusDescription('');
                        setStatusPrice('');
                        setStatusStock('');
                        setStatusType('');
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Sider width={256}>
                    <Menu keySelected='2' /> 
                </Sider>
                <Content className='container-content'>
                    <h3 className='text-center'> Produit : {productId} </h3>
                    <Form>
                        <Form.Item label='Ajouter une image' validateStatus={statusImg} hasFeedback>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                            >
                            </Upload>
                            <Upload>
                                <Button>
                                <Icon type="upload" /> Click to Upload
                                </Button>
                            </Upload>
                            {/* <Input placeholder='Image Url' value={img} onChange={(e) => setImg(e.target.value)} /> */}
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
                        <Form.Item label='Typpe du produit' validateStatus={statusType} hasFeedback>
                            <Select placeholder="Sélectionner un type" value={type} onChange={(e) => setType(e)}>
                                <Option value="crayons de couleur">Crayons de couleur</Option>
                                <Option value="marqueur">Marqueur</Option>
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

export default EditProduct;