import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { InputNumber, Input, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { adressIp } from '../config';
import Header from './Header';
import Footer from './Footer';

const { Search } = Input;

function Panier(props) {
    const [productList, setProductList] = useState([]);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(2);
    const [totalOrder, setTotalOrder] = useState(0);

    //Fonction qui prend le tableau du panier en argument et qui calcul le prix total du panier
    var calculPrice = (array) => {
        var totalPrice = 0
        for(var i = 0; i < array.length; i++) {
            totalPrice += array[i].price
        };

        setTotalProductPrice(totalPrice);
        setTotalOrder(totalPrice + totalDeliveryPrice)
    }
    console.log('user panier', props.userPanier)
    console.log('product panier', productList)
    //Permet de recuperer le panier au chargement de la page
    useEffect(() => {
        fetch(`http://${adressIp}:3000/getUserPanier?userToken=${props.userToken}`, {
            withCredentials: true,
            credentials: 'include',
        })
        .then(response => {
            return response.json()
        })
        .then(datas => {
            console.log('MY DATAS', datas);
            if(datas.result) {
                setProductList(datas.result.panier)
                if(datas.result.panier) {
                    calculPrice(datas.result.panier);
                }
            } else if(datas.cookie) {
                setProductList(datas.cookie.panier);
                if(datas.cookie.panier) {
                    calculPrice(datas.cookie.panier);
                }
            }    
        })
        .catch(err => {
            console.log(err)
        })
    }, [props.userToken, props.isConnected])

    //Fonction pour supprimer un produit et mettre a jour le state du panier
    var deleteProduct = (positionProduct) => {
        props.deleteProduct(positionProduct);
        var datasBody = JSON.stringify({
            userToken: props.userToken,
            positionProduct: positionProduct
        })

        fetch(`http://${adressIp}:3000/deleteProduct`,
        {
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
                setProductList(datas.result.panier);
                calculPrice(datas.result.panier);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    //Fonction pour valider son panier et commencer a créer une commande
    var validateOrder = () => {
        var datasBody = JSON.stringify({
            products : props.userPanier,
            totalProductsPrice : totalProductPrice,
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
        props.createOrder(props.userPanier, totalProductPrice, totalDeliveryPrice, totalOrder);
    }


    //Variable qui permet d'afficher les produits du panier si il y en a, ou un message si il y en a pas
    let checkProductList
    if(productList && productList.length < 1){
        checkProductList = 
            <h3 style={{padding: '0.5em'}}> Vous n'avez pas de produit dans votre panier </h3>
    } else {
        checkProductList = 
                productList.map((element, i) => (
                    <li className='items-product-list' key={i}>
                        <div className='img-product-list' style={{backgroundImage: `url(${element.images})`}} >  </div>
                        <div className='product-info' >
                            {/* <Link> */}
                                <h5 className='title-product-list'> {element.name} </h5>
                            {/* </Link> */}
                            <p className='attribute-product-list'> Type: {element.type} </p>
                            <h6> {element.price} € </h6>
                        </div>
                        <div className='input-number'>
                            <InputNumber size="large" min={1} max={10} defaultValue={1} />
                        </div>
                        <div className='price-info'>
                            <h6 className='price-bold'> {element.price} €</h6>
                        </div>
                        <div className='delete-button' >
                            <Icon type="delete" theme="filled" style={{fontSize:'25px'}} onClick={() => deleteProduct(i)} />
                        </div>
                    </li>
                ))     
    }

    let buttonValidCart;
    if(props.isConnected) {
        buttonValidCart =
            <Link to={{pathname: '/addressForm'}}>
                <Button className='button-confirm-order' color= 'info' onClick={() => validateOrder()}> Confirmer mon panier </Button>
            </Link>
    } else {
        buttonValidCart =
            <Link to={{pathname: '/Signin', state : {linkFrom: 'panier' }}}>
                <Button className='button-confirm-order' color= 'info' onClick={() => validateOrder()}> Confirmer mon panier </Button>
            </Link>
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
                                {checkProductList}
                            </ul>
                        </Col>
                        <Col lg={{size: 4, offset:0}} xs={{size: 8, offset: 2}} md={{size: 6, offset: 3}} > 
                            <div className='container-total'>
                                <div className='total'>
                                    <div className='product-total'>
                                        Produits  
                                        <span className='amount'> {totalProductPrice} € </span>
                                    </div>
                                    <div className='delivery-total'>
                                        Livraison  
                                        <span className='amount'> {totalDeliveryPrice} € </span>
                                    </div>
                                    <hr />
                                    <div className='order-total'>
                                        Total  
                                        <span className='amount'> {totalOrder} € </span>
                                    </div>
                                    <div className='text-center confirm-order'>
                                       {buttonValidCart}
                                    </div>
                                </div>
                            </div>

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
        userPanier: state.User.panier
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
        deleteProduct : function(index) {
            dispatch({
                type : 'deleteProduct',
                index : index,
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProp
)(Panier)