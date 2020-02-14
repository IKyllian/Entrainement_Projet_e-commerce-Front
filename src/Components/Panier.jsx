import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { adressIp } from '../config';
import Header from './Header';
import Footer from './Footer';
import ListPanier from './ListPanier';
import CardTotal from './Card-Total';

const { Search } = Input;

const ButtonValidCart = ({isConnected, validateFunction}) => {
    const handleClick = () => validateFunction();
    return (
        <Link to={isConnected ? {pathname: '/addressForm'} : {pathname: '/Signin', state : {linkFrom: 'panier' }}}>
            <Button className='button-confirm-order' color= 'info' onClick={() => handleClick()}> Confirmer mon panier </Button>
        </Link>
    );
}

function Panier(props) {
    const [productList, setProductList] = useState([]);
    const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(2);
    const [totalOrder, setTotalOrder] = useState(0);

    //Permet de recuperer le panier au chargement de la page
    useEffect(() => {
        setTotalOrder(totalDeliveryPrice + props.cartPrice)
    }, [props.cartPrice])

    useEffect(() => {
        fetch(`http://${adressIp}:3000/getUserPanier?userToken=${props.userToken}`, {
            withCredentials: true,
            credentials: 'include',
        })
        .then(response => {
            return response.json()
        })
        .then(datas => {
            if(datas.result) {
                setProductList(datas.result.panier)
            } else if(datas.cookie) {
                setProductList(datas.cookie.products);
            }    
        })
        .catch(err => {
            console.log(err)
        })
    }, [props.userToken, props.isConnected])

    //Fonction pour supprimer un produit et mettre a jour le state du panier
    const deleteProduct = async (positionProduct, price) => {
        await props.deleteProduct(positionProduct, price);
        var datasBody = JSON.stringify({
            userToken: props.userToken,
            positionProduct: positionProduct
        })

        fetch(`http://${adressIp}:3000/deleteProduct`,
        {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
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
            if(datas.result) {
                setProductList(datas.result.panier);
            } else if(datas.resultCookie) {
                setProductList(datas.resultCookie.products);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    //Fonction pour valider son panier et commencer a créer une commande
    const validateOrder = () => {
        if(props.userPanier && props.userPanier.length > 0)  {
            var datasBody = JSON.stringify({
                products : props.userPanier,
                totalProductsPrice : props.cartPrice,
                totalDeliveryPrice : totalDeliveryPrice,
                totalOrder : totalOrder
            })
            fetch(`http://${adressIp}:3000/createOrderCart`, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: datasBody
            })
            props.createOrder(props.userPanier, props.cartPrice, totalDeliveryPrice, totalOrder);
        }
    }
    return (
        <Container fluid={true}>
            <Header productList={productList} />
            <h3 className='text-center title-page-panier'> Récapitulatif de mon panier </h3>
            <Row lg='2' xs='1' className='container-panier'>
                <Col lg={{size: 10, offset:1 }} style={{minHeight: '100px'}}>
                    <Row md='2'>
                        <Col lg={{size: 8, offset: 0}} md={{size: 12}}>
                            <ul className= 'product-list' >
                                <ListPanier userPanier={productList} deleteFunction={deleteProduct} />
                            </ul>
                        </Col>
                        <Col lg={{size: 4, offset:0}} xs={{size: 8, offset: 2}} md={{size: 6, offset: 3}} > 
                            <CardTotal productsPrice={props.cartPrice} deliveryPrice={totalDeliveryPrice} totalPrice={totalOrder}
                                buttonDisplay={
                                    <div className='text-center confirm-order'>
                                        <ButtonValidCart isConnected={props.isConnected} validateFunction={validateOrder} />
                                    </div>
                                }
                            />
                            <div className='container-coupon'>
                                <div>
                                    <Search
                                        placeholder="Mon bon de reduction"
                                        enterButton="Ajouter"
                                        size="large"
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
           <Footer />
        </Container>
    );
}

function mapStateToProps(state) {
    return {
        isConnected : state.UserConnected,
        userToken: state.User.token,
        userPanier: state.User.panier,
        cartPrice: state.User.cartPrice
    }
}

function mapDispatchToProp(dispatch) {
    return {
        createOrder : function(products, productsPrice, deliveryPrice, totalOrder) {
            dispatch({
                type : 'createOrder',
                products : products,
                productsPrice : productsPrice,
                deliveryPrice : deliveryPrice,
                totalOrder : totalOrder
            })
        },
        deleteProduct : function(index, price) {
            dispatch({
                type : 'deleteProduct',
                index : index,
                cartPrice : price
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProp
)(Panier)