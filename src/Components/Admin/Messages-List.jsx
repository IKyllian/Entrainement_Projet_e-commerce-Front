import React, { useState, useEffect } from 'react';
import { Layout, List, Input, Badge, Modal } from 'antd';
import Menu from './Menu';
import {adressIp} from '../../config';

import NavHeader from './Nav'
const { Sider, Content } = Layout; 
const { Search } = Input;

function MessagesList() {
    const [messagesList, setMessagesList] = useState([]);
    const [messagesListCpy, setMessagesListCpy] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(0);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/getMessages`)
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    setMessagesList(datas.response.reverse());
                    setMessagesListCpy(datas.response);
                }
            })
            .catch(err => {
                console.log(err)
            })
    },[updateMessage])

    const showModal = async (messageId, isRead) => {
        if(!isRead){
            await fetch(`http://${adressIp}:3000/admin/changeStatusMessage?id=${messageId}`)
            .then(response => response.json())
            .then(datas => {
                if(datas) {
                    setUpdateMessage(state => state + 1);
                }
            })
            .catch(err => console.log(err));
        }
        setModalVisible(true);
    }

    const handleOk = () => {
        setModalVisible(false);
      };
    
    const handleCancel = () => {
        setModalVisible(false);
      };

    const handleChange = (e) => {
            const cpy = [...messagesListCpy];
            var arrayFilter = []
            //Filtre le nom, prenom ou email a partir de la recherche + prend en compte si la recherche contient plus de 1 mot
            arrayFilter = cpy.filter(element => e.toLowerCase() === element.email.toLowerCase().substring(0, e.length))
            setMessagesList(arrayFilter);
    }
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Menu keySelected='6' /> 
                <Content className='container-content'>
                    <h2 className='text-center'> Liste Utilisateurs </h2>
                    <Search placeholder='Rechrche par Nom, Prenom ou Email' onChange={(e) => handleChange(e.target.value)} className='search-bar-admin' />
                        <List
                            dataSource={messagesList}
                            pagination={{
                                pageSize: 10,
                            }}
                            renderItem={item => (
                                <>
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={
                                            <>
                                                {
                                                    !item.message_is_read &&
                                                    <Badge status="processing" />
                                                }
                                                <span onClick={() => showModal(item._id, item.message_is_read)} className='span-title'> {item.title} </span>
                                           </>
                                        }
                                        description={
                                            `${item.email}`
                                        }
                                    />
                                    <div> 
                                        Inscription : {`${new Date(item.date_send).getDate()}/${new Date(item.date_send).getMonth() + 1}/${new Date(item.date_send).getFullYear()}`}
                                        </div>
                                </List.Item>
                                <Modal
                                    title={item.email}
                                    visible={modalVisible}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                >
                                    <h6> {item.title} </h6>
                                    <p> {item.message} </p>
                                </Modal>
                                </>
                            )}
                        >
                        </List>
                </Content>
            </Layout>
        </Layout>
    );
}

export default MessagesList;