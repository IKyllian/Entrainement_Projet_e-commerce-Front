import React, {useState, useEffect} from 'react'
import {Icon, Badge, Drawer, Button, notification } from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    Navbar,
    Nav,
    Dropdown,
    DropdownToggle,
    NavbarText
  } from 'reactstrap';


import MenuBurger from './MenuBurger';
import PanierHeader from './PanierHeader';
import DropdownUser from './DropdownUser';
import NavHeader from './NavHeader';
import {adressIp} from '../../config';

function Header(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [nbItemPanier, setNbItemPanier] = useState(0);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [burgerDrawerVisible, setBurgerDrawerVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [productsQuantity, setProductsQuantity] = useState([]);

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            `Un problème est survenue lors de la suppression du produit, veuillez réesayer plus tard si cela persiste`,
        });
    };

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const onClose = () => {
        setDrawerVisible(false);
    }

    const showDrawer = () => {
        setDrawerVisible(true);
    }

    const onCloseBurger = () => {
        setBurgerDrawerVisible(false);
    }

    const showDrawerBurger = () => {
        setBurgerDrawerVisible(true);
    }
    
    //Permet de mettre a jour le infos du panier sur le header
    useEffect(() => {
        if(props.userPanier) {
            setNbItemPanier(props.userPanier.length)
        }
        
        fetch(`http://${adressIp}:3000/getUserPanier?userToken=${props.userToken}`, {
            withCredentials: true,
            credentials: 'include',
        })
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas.result && datas.result.panier) {                
                setCartItems(datas.result.panier);
                setProductsQuantity(datas.result.productsQuantity);
            } else if(datas.cookie && datas.cookie.products) {
                setCartItems(datas.cookie.products);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [props.userToken, props.cartPrice, props.userPanier])
   // [props.userPanier, props.productList, props.userToken]
    //fonction qui permet de deconnecter le user (appel de la route back, et des fonctions pour le reducer)
    var handleLogout = () => {
        fetch(`http://${adressIp}:3000/users/logout`, {
            withCredentials: true,
            credentials: 'include',
        })
        props.logout()
        props.userConnected(false)
    }

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
                    setCartItems(datas.result.panier);
                } else if(datas.resultCookie) {
                    setCartItems(datas.resultCookie.products);
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

    return (
        <div className='containerHeader'>
            <NavHeader />
            <Navbar color="light" light expand="md" style={{height: '60%'}}>
                <Nav className="mr-auto" navbar >
                    <Icon type="menu" style={{fontSize:'30px', marginLeft:'0.5em'}} onClick={() => showDrawerBurger()} />
                    <MenuBurger drawerState={burgerDrawerVisible} onClose={onCloseBurger} handleLogout={handleLogout} userRole={props.userRole} />
                </Nav>
                <NavbarText className='navBarTextHeader'><Icon type="search" style={{fontSize:'30px'}} /></NavbarText>
                <NavbarText className='navBarTextHeader navBarTextResponsive'>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>                        
                        <DropdownToggle>
                            <Icon type="user" style={{fontSize:'30px'}} />
                        </DropdownToggle>
                        <DropdownUser userIsConnected={props.userIsConnected} userLastName={props.userLastName} handleLogout={handleLogout} />
                    </Dropdown>
                </NavbarText>
                <NavbarText className='navBarPanier navBarTextResponsive'>
                    <Badge count={nbItemPanier} showZero>
                        <Icon type="shopping-cart" style={{fontSize:'30px'}} />
                    </Badge>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                        {/* <Link to='/Panier'> */}
                            <p onClick={() => showDrawer()} className='textPanierHeader'> Votre panier</p>
                        {/* </Link> */}
                        <Drawer
                            title="Votre Panier"
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            visible={drawerVisible}
                            width={590}
                        >
                            <div>
                                <ul className= 'product-list'>
                                   <PanierHeader items={cartItems} productsQuantity={productsQuantity} deleteFunction={deleteProduct}/>
                                </ul>   
                            </div>
                            <Link to='/panier'>
                                <Button className='float-right' type='primary'> Allez au panier </Button>
                            </Link>
                        </Drawer>
                        <p className='textPanierHeader'>{props.cartPrice} €</p>
                        </div>
                </NavbarText>
            </Navbar>                    
        </div>
    );
}

function mapStateToProps(state) {
    return {
        userIsConnected: state.UserConnected,
        userToken: state.User.token,
        userPanier: state.User.panier,
        userLastName: state.User.lastName,
        cartPrice : state.User.cartPrice,
        userRole: state.User.role
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: function() {
            dispatch({
                type: 'logout',
            })
        },
        userConnected: function(isConnected) {
            dispatch({
                type: 'changeStatus',
                isConnected: isConnected
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
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Header)