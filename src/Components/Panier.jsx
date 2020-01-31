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

    //Permet de recuperer le panier au chargement de la page
    useEffect(() => {
        fetch(`http://${adressIp}:3000/getUserPanier?userToken=${props.userToken}`)
        .then(response => {
            return response.json()
        })
        .then(datas => {
            if(datas.result) {
                setProductList(datas.result.panier)
                if(datas.result.panier) {
                    calculPrice(datas.result.panier);
                }
            }    
        })
        .catch(err => {
            console.log(err)
        })
    }, [props.userToken])

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
        props.createOrder(props.userPanier, totalProductPrice, totalDeliveryPrice, totalOrder);
    }


    //Variable qui permet d'afficher les produits du panier si il y en a, ou un message si il y en a pas
    let checkProductList
    if( productList && productList.length < 1){
        checkProductList = 
            <h2> Vous n'avez pas de produit </h2>
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

    return (
        <Container fluid={true}>
            <Header productList={productList} />
            <h3 className='text-center title-page-panier'> Récapitulatif de mon panier </h3>
            <Row lg='2' xs='1'>
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
                                        <Link to='/addressForm'>
                                            <Button className='button-confirm-order' color= 'info' onClick={() => validateOrder()}> Confirmer mon panier </Button>
                                        </Link>
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