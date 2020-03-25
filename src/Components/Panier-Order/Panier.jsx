import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Input, notification } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { adressIp } from '../../config';
import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
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

const openNotificationWithIcon = (type, action) => {
    notification[type]({
      message: 'Une erreur est survenue',
      description:
        `Un problème est survenue lors ${action === 'delete' ? 'de la suppression du produit' : 'du changement de quantité'}, veuillez réesayer plus tard si cela persiste`,
    });
};

function Panier(props) {
    const [productList, setProductList] = useState([]);
    const [productsQuantity, setProductsQuantity] = useState([]);
    const [totalDeliveryPrice] = useState(2);
    const [totalOrder, setTotalOrder] = useState(0);

    //Permet de recuperer le panier au chargement de la page
    useEffect(() => {
        setTotalOrder(totalDeliveryPrice + props.cartPrice)
    }, [props.cartPrice, totalDeliveryPrice])

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
                setProductList(datas.result.panier);
                setProductsQuantity(datas.result.productsQuantity)
            } else if(datas.cookie) {
                setProductList(datas.cookie.products);
                setProductsQuantity(datas.cookie.productsQuantity)
            }    
        })
        .catch(err => {
            console.log(err)
        })
    }, [props.userToken, props.isConnected])

    //Fonction pour supprimer un produit et mettre a jour le state du panier
    const deleteProduct = async (positionProduct, price) => {
     
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
            if(!datas.errDelete) {
                if(datas.result) {
                    setProductList(datas.result.panier);
                } else if(datas.resultCookie) {
                    setProductList(datas.resultCookie.products);
                }
                if(datas.productDelete) {
                    // Si la quantité du produit est à 1 supprime le produit + la quantité dans le tableau
                    props.deleteProduct(positionProduct, price);
                } else {
                    // Si la quantité est superieur à 1 update la quantité du produit en faisant -1
                    props.deleteQuantity(positionProduct, price);
                    var cpyState = [...productsQuantity];
                    cpyState[positionProduct] = cpyState[positionProduct] - 1;
                    setProductsQuantity(cpyState);
                }
            } else {
                openNotificationWithIcon('error', 'delete');
            }  
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleChangeQuantity = (value, index, price) => {
        var datasBody = JSON.stringify({
            userToken: props.userToken,
            index: index,
            value: value
        })

        fetch(`http://${adressIp}:3000/changeProductQuantity`,
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
                var cpyQuantity = [...productsQuantity];
                cpyQuantity[index] = value;
                setProductsQuantity(cpyQuantity);
                props.changeProductQuantity(index, value, price);
            } else {
                openNotificationWithIcon('error', 'quantity');
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
                productsQuantity: props.productsQuantity,
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
            props.createOrder(props.userPanier,props.productsQuantity, props.cartPrice, totalDeliveryPrice, totalOrder);
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
                                <ListPanier userPanier={productList} deleteFunction={deleteProduct} productsQuantity={productsQuantity} handleChange={handleChangeQuantity}/>
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
    console.log('state',state)
    return {
        isConnected : state.UserConnected,
        userToken: state.User.token,
        userPanier: state.User.panier,
        cartPrice: state.User.cartPrice,
        productsQuantity: state.User.productsQuantity
    }
}

function mapDispatchToProp(dispatch) {
    return {
        createOrder : function(products, productsQuantity, productsPrice, deliveryPrice, totalOrder) {
            dispatch({
                type : 'createOrder',
                products : products,
                productsPrice : productsPrice,
                deliveryPrice : deliveryPrice,
                totalOrder : totalOrder, 
                productsQuantity : productsQuantity
            })
        },
        deleteProduct : function(index, price) {
            dispatch({
                type : 'deleteProduct',
                index : index,
                cartPrice : price
            })
        },
        deleteQuantity : function(index, price) {
            dispatch({
                type: 'deleteQuantity',
                index : index,
                cartPrice: price
            })
        },
        changeProductQuantity : function(index, value, price) {
            dispatch({
                type: 'changeProductQuantity',
                index: index,
                value: value,
                price: price
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProp
)(Panier)