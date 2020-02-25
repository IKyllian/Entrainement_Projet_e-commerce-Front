import React, {useEffect, useState} from 'react'
import { Container, Row, Col } from 'reactstrap';
import { Collapse, Icon, Popover, Empty } from 'antd';
import {connect} from 'react-redux';

import Header from '../Menu/Header';
import ProfilPageMenu from './NavMenu';
import Footer from '../Menu/Footer'
import {adressIp} from '../../config';

const { Panel } = Collapse;

const DescOrders = ({ date, status, id }) => (
    <div style={{display:'flex', justifyContent: 'space-between'}}>
        <p style={{margin: 0}}> {id} - {date} </p>
        <p style={{margin: 0}}> Status : {status} </p>    
    </div>
)

const OrdersList = ({ordersList}) => {
    if(ordersList && ordersList.length < 1) {
        return (
            <Empty description={'Vous n\'avez pas encore fait de commande :('} />
        )
    } else {
        return (
            <Collapse className='mb-5'>
                {ordersList.map((element, index) => (
                    <Panel header={<DescOrders id={element._id} date='21/04/2020' status='livrée' />} key={index}>
                        <ul className='product-list'> 
                            {element.products.map((items, i) => (
                                <li key={i} className='items-product-list'>
                                    <div className='img-product-list-commande' style={{backgroundImage: `url(${items.images})`}}>  </div>
                                    <div className='product-info' >
                                        <h5 className='title-product-list'> {items.name} </h5>
                                        <p className='attribute-product-list'> Type: {items.type} </p>
                                    </div>
                                    <div className='price-info ml-md-5'>
                                        <h6 className='price-bold'> {items.price} €</h6>
                                    </div>    
                                </li>
                            ))}    
                        </ul>
                        <Popover className='float-right popover-total' content='Inclut les frais de livraison' placement="bottom">
                            <Icon type="question-circle" theme="twoTone" style={{fontSize: '14px'}}/>
                        </Popover>
                        <h6 className='float-right total-price-info-order mr-md-4'> Prix total : {element.cost} €</h6>
                </Panel>
                ))}
            </Collapse>
        )
    }
}


function ProfilPageOrders(props) {
    const [userOrders, setUserOrders] = useState([])

    useEffect(() => {
        fetch(`http://${adressIp}:3000/getUserOrders?userToken=${props.userToken} `, {
            withCredentials: true,
            credentials: 'include',
        })
        .then(response => {
            return response.json();
        })
        .then(datas => {
            console.log(datas)
            if(datas) {
                setUserOrders(datas.result.orders);
            }
        })
        .catch(err => {
            console.log(err)
        })
    },[props.userToken])
    
    return(
        <Container fluid={true}>
            <Header />
            <Row md='2' sm='1' className='container-row-profil'>
                <Col md={{size: 3 ,offset: 2}} sm={{size: 10, offset: 1}}>
                    <ProfilPageMenu item='2' />
                </Col>
                <Col>
                    <h3 className='text-center'> Vos Commandes </h3>
                    <OrdersList ordersList={userOrders} />
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}

function mapStateToProps(state) {
    return{
        userToken: state.User.token
    }
}

export default connect(
    mapStateToProps, 
    null
)(ProfilPageOrders)
