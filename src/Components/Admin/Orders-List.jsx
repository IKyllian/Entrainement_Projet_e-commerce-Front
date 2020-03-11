import React, { useState, useEffect } from 'react';
import { Layout, List, Input } from 'antd';
import { Link } from 'react-router-dom';

import Menu from './Menu';
import {adressIp} from '../../config';
import NavHeader from './Nav';

const { Sider, Content } = Layout; 
const { Search } = Input; 

function OrdersList() {
    const [ordersList, setOrdersList] = useState([]);
    const [ordersListCpy, setOrdersListCpy] = useState([]);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/getOrders`)
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    setOrdersList(datas.response);
                    setOrdersListCpy(datas.response);
                }
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    const handleChange = (e) => {
        if(e[e.length - 1] !== ' ') {
            var indexSpace = null;
            //Permet de check si il y a un espace dans la recherche
            if(e[e.length - 1] !== ' ') {
               for(var i = 0; i < e.length; i++){
                    if(e[i] === ' ')
                        indexSpace = i;
               } 
                const cpy = [...ordersListCpy];
                var arrayFilter = []
                //Filtre le nom, prenom ou email a partir de la recherche + prend en compte si la recherche contient plus de 1 mot
                arrayFilter = cpy.filter(element => indexSpace === null ? e.toLowerCase() === element._id.toLowerCase().substring(0, e.length) : e.substring(indexSpace + 1).toLowerCase() === element._id.toLowerCase().substring(0, e.substring(indexSpace + 1).length))
                if(arrayFilter.length < 1) {
                    arrayFilter = cpy.filter(element => indexSpace === null ? e.toLowerCase() === element.user.first_name.toLowerCase().substring(0, e.length) : e.substring(indexSpace + 1).toLowerCase() === element.user.first_name.toLowerCase().substring(0, e.substring(indexSpace + 1).length))
                    if(arrayFilter.length < 1) {
                        arrayFilter = cpy.filter(element => indexSpace === null ? e.toLowerCase() === element.user.last_name.toLowerCase().substring(0, e.length) : e.substring(indexSpace + 1).toLowerCase() === element.user.last_name.toLowerCase().substring(0, e.substring(indexSpace + 1).length))
                    }
                }
            }
            setOrdersList(arrayFilter);
        }
    }
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Menu keySelected='3' /> 
                <Content className='container-content'>
                    <h2 className='text-center'> Liste Commandes </h2>
                    <Search placeholder='Rechercher par id ou par utilisateur' onChange={(e) => handleChange(e.target.value)} className='search-bar-admin' />
                        <List
                            dataSource={ordersList}
                            pagination={{
                                pageSize: 10,
                            }}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={
                                            <Link to={`AdminOrderDesc/${item._id}`}>
                                                {item._id}
                                            </Link> 
                                        }
                                        description={
                                            `Utilisateur: ${item.user.first_name} ${item.user.last_name}`
                                        }
                                    />
                                    <div> 
                                        Date : {`${new Date(item.date_insert).getDate()}/${new Date(item.date_insert).getMonth() + 1}/${new Date(item.date_insert).getFullYear()}`}
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

export default OrdersList;