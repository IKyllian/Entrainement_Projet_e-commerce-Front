import React, { useState } from 'react';
import { Layout, Descriptions, PageHeader, Statistic, Badge, Collapse } from 'antd';

import Menu from './Menu';
import {adressIp} from '../../config';
import NavHeader from './Nav';
import { useEffect } from 'react';

const { Sider, Content } = Layout;
const { Panel } = Collapse;

const renderContent = (userOrder) =>(
    userOrder.user &&
        <Descriptions size="middle" column={2}>
            <Descriptions.Item label="Nom-Prenom">{userOrder.user.first_name} {userOrder.user.last_name}</Descriptions.Item>
            <Descriptions.Item label="Adresse Livraison">{userOrder.delivery_address}</Descriptions.Item>
            <Descriptions.Item label="Ville">{userOrder.delivery_city}</Descriptions.Item>
            <Descriptions.Item label="Zip Code">{userOrder.delivery_zipCode}</Descriptions.Item>
            <Descriptions.Item label="Date">
                {`${new Date(userOrder.date_insert).getDate()}/${new Date(userOrder.date_insert).getMonth() + 1}/${new Date(userOrder.date_insert).getFullYear()}`}
            </Descriptions.Item>
        </Descriptions>
);

const extraContent = userOrder => (
  <div className='extra-content-admin'>
    <Statistic
      title="Status"
      value="Pending"
      style={{
        marginRight: 32,
      }}
    />
    <Statistic title="Price" prefix="€" value={userOrder.cost} />
  </div>
);

const ContentOrder = ({ children, extra }) => {
  return (
    <div className="content-order">
      <div className="main">{children}</div>
      <div className="extra">{extra}</div>
    </div>
  );
};

function OrderDesc(props) {
    const [userOrder, setUserOrder] = useState({});
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/getOrder?id=${props.match.params.id}`)
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    console.log(datas)
                    setUserOrder(datas.response);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [props.match.params.id])
    return (
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Menu keySelected='3' /> 
                <Content className='container-content'>
                    <PageHeader
                        style={{
                            border: '1px solid rgb(235, 237, 240)',
                        }}
                        onBack={() => window.history.back()}
                        title={`N° ${userOrder._id}`}
                    >
                        <ContentOrder extra={extraContent(userOrder)}>{renderContent(userOrder)}</ContentOrder>
                    </PageHeader>
                    <Collapse className='mb-5' defaultActiveKey={['1']}>
                        <Panel header='Produits' key='1'>
                            <ul className='product-list'> 
                                {
                                userOrder &&
                                userOrder.products && 
                                    userOrder.products.map((items, i) => (
                                        <li key={i} className='items-product-list'>
                                            <Badge count={userOrder.productsQuantity[i]}  showZero>
                                                <div className='img-product-list-commande' style={{backgroundImage: `url(${items.images})`}}>  </div>
                                            </Badge>
                                            <div className='product-info-admin' >
                                                <h5 className='title-product-list'> {items.name} </h5>
                                                <p className='attribute-product-list'> Type: {items.type} </p>
                                            </div>
                                            <div className='price-info'>
                                                <h6 className='price-bold'> {items.price * userOrder.productsQuantity[i]} €</h6>
                                            </div>    
                                        </li>
                                    ))}    
                            </ul>
                        </Panel>
                    </Collapse>
                </Content>
            </Layout>
        </Layout>
    );
}

export default OrderDesc