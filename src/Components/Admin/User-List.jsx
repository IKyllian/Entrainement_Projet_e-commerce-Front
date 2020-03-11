import React, { useState, useEffect } from 'react';
import { Layout, List, Input } from 'antd';
import Menu from './Menu';
import {adressIp} from '../../config';

import NavHeader from './Nav'
const { Sider, Content } = Layout; 
const { Search } = Input;

function UserList() {
    const [userList, setUserList] = useState([]);
    const [userListCpy, setUserListCpy] = useState([]);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/getUsers`)
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    setUserList(datas.response);
                    setUserListCpy(datas.response);
                }
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    const handleChange = (e) => {
        var indexSpace = null;
        //Permet de check si il y a un espace dans la recherche
        if(e[e.length - 1] !== ' ') {
           for(var i = 0; i < e.length; i++){
                if(e[i] === ' ')
                    indexSpace = i;
           } 
            const cpy = [...userListCpy];
            var arrayFilter = []
            //Filtre le nom, prenom ou email a partir de la recherche + prend en compte si la recherche contient plus de 1 mot
            arrayFilter = cpy.filter(element => indexSpace === null ? e.toLowerCase() === element.first_name.toLowerCase().substring(0, e.length) : e.substring(indexSpace + 1).toLowerCase() === element.first_name.toLowerCase().substring(0, e.substring(indexSpace + 1).length))
            if(arrayFilter.length < 1) {
                arrayFilter = cpy.filter(element => indexSpace === null ? e.toLowerCase()=== element.last_name.toLowerCase().substring(0, e.length) : e.substring(indexSpace + 1).toLowerCase() === element.last_name.toLowerCase().substring(0, e.substring(indexSpace + 1).length))
                if(arrayFilter.length < 1) {
                    arrayFilter = cpy.filter(element => indexSpace === null ? e.toLowerCase()=== element.email.toLowerCase().substring(0, e.length) : e.substring(indexSpace + 1).toLowerCase() === element.email.toLowerCase().substring(0, e.substring(indexSpace + 1).length))
                }
            }
            setUserList(arrayFilter);
        }
    }
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Menu keySelected='1' /> 
                <Content className='container-content'>
                    <h2 className='text-center'> Liste Utilisateurs </h2>
                    <Search placeholder='Rechrche par Nom, Prenom ou Email' onChange={(e) => handleChange(e.target.value)} className='search-bar-admin' />
                        <List
                            dataSource={userList}
                            pagination={{
                                pageSize: 10,
                            }}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={
                                            `${item.first_name}  ${item.last_name}`
                                        }
                                        description={
                                            `${item.email}`
                                        }
                                    />
                                    <div> 
                                        Inscription : {`${new Date(item.dateInsert).getDate()}/${new Date(item.dateInsert).getMonth() + 1}/${new Date(item.dateInsert).getFullYear()}`}
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

export default UserList;