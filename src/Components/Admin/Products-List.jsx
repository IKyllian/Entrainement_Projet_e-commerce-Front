import React, { useState, useEffect } from 'react';
import { Layout, List, Input} from 'antd';
import { Link } from 'react-router-dom';

import Menu from './Menu';
import {adressIp} from '../../config';
import NavHeader from './Nav';
const { Sider, Content } = Layout; 
const { Search } = Input;

function ProductsList() {
    const [productsList, setProductsList] = useState([]);
    const [productsListCpy, setProductsListCpy] = useState([]);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/getProducts`)
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    setProductsList(datas.response);
                    setProductsListCpy(datas.response);
                }
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    const handleChange = (e) => {
        //Permet de check si il y a un espace dans la recherche
        if(e[e.length - 1] !== ' ') {
            const cpy = [...productsListCpy];
            var arrayFilter = []
            //Filtre le nom, prenom ou email a partir de la recherche + prend en compte si la recherche contient plus de 1 mot
            arrayFilter = cpy.filter(element => e.toLowerCase() === element._id.toLowerCase().substring(0, e.length))
            if(arrayFilter.length < 1) {
                arrayFilter = cpy.filter(element => e.toLowerCase() === element.name.toLowerCase().substring(0, e.length))
            }
            setProductsList(arrayFilter);
        }
    }
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Menu keySelected='2' /> 
                <Content className='container-content'>
                    <h2 className='text-center'> Liste des produits </h2>
                    <Search placeholder='Rechercher par id' onChange={(e) => handleChange(e.target.value)} className='search-bar-admin' />
                        <List
                        dataSource={productsList}
                        pagination={{
                            pageSize: 6,
                        }}
                        renderItem={item => (
                            
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        avatar={<div className='img-product-list-commande' style={{backgroundImage: `url(${item.images[0]})`}}>  </div>}
                                        title={
                                            <Link to={`/AdminEditProduct/${item._id}`}>
                                                {item._id}
                                            </Link>
                                        }
                                        description={
                                            `${item.name}`
                                        }
                                    />
                                    <div> 
                                        Prix : {item.price} €
                                        </div>
                                </List.Item>
                        )}
                        >
                        </List>
                </Content>
            </Layout>
        </Layout>
    );
}

export default ProductsList;