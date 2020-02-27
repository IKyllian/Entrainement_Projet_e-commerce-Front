import React, {useState, useEffect} from 'react'
import {Icon, Badge, Drawer, Button } from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    Navbar,
    Nav,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';


import PanierHeader from './PanierHeader'
import NavHeader from './NavHeader';
import {adressIp} from '../../config';

function Header(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [nbItemPanier, setNbItemPanier] = useState(0);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [burgerDrawerVisible, setBurgerDrawerVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [productsQuantity, setProductsQuantity] = useState([]);

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
        
        fetch(`http://${adressIp}:3000/dataHeaderPanier?userToken=${props.userToken}`, {
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

    //Dropdown qui change en fonction du status du user (connecter ou non)
    let myDropdown
    if(props.userIsConnected) {
        myDropdown = 
            <DropdownMenu style={{width: '15em'}}>
                <p className='text-center pDropdown'> Bonjour {props.userLastName} ! </p>
                <DropdownItem divider />
                <Link to="/ProfilPage" >
                    <DropdownItem className='text-center'> Profil</DropdownItem>
                </Link>
                <Link to="/ProfilPage" >
                    <DropdownItem className='text-center'> Mes commandes</DropdownItem>
                </Link>
                {/* <Link to="/PaymentConfirm">
                    <DropdownItem className='text-center'> Reprendre ma commande</DropdownItem>
                </Link> */}
                <DropdownItem divider />
                <DropdownItem header className='text-center' style={{fontSize: '12px'}}> <p onClick={() => handleLogout()}> Déconnexion </p> </DropdownItem>
            </DropdownMenu>
        
      } else {
        myDropdown = 
            <DropdownMenu style={{width: '15em'}}>
                <Link to={{pathname: '/Signin', state: {linkFrom: 'header'} }}>
                    <DropdownItem className='text-center'>Se Connecter</DropdownItem>
                </Link>
                <DropdownItem divider />
                <Link to='/Signup' >
                    <DropdownItem className='text-center' style={{fontSize: '12px'}}>Pas de compte? Créez-en un</DropdownItem>
                </Link>
            </DropdownMenu>
      }
    return (
        <div className='containerHeader'>
            <NavHeader />
            <Navbar color="light" light expand="md" style={{height: '60%'}}>
                <Nav className="mr-auto" navbar >
                    <Icon type="menu" style={{fontSize:'30px', marginLeft:'0.5em'}} onClick={() => showDrawerBurger()} />
                    <Drawer
                        title="Header"
                        closable={false}
                        onClose={onCloseBurger}
                        visible={burgerDrawerVisible}
                        placement= 'left'
                        width={290}
                    >
                        <div>

                        </div>
                    </Drawer>
                </Nav>
                <NavbarText className='navBarTextHeader'><Icon type="search" style={{fontSize:'30px'}} /></NavbarText>
                <NavbarText className='navBarTextHeader'>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>                        
                        <DropdownToggle>
                            <Icon type="user" style={{fontSize:'30px'}} />
                        </DropdownToggle>
                        {myDropdown}
                    </Dropdown>
                </NavbarText>
                <NavbarText className='navBarPanier'>
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
                                   <PanierHeader items={cartItems} productsQuantity={productsQuantity} />
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
        cartPrice : state.User.cartPrice
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
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Header)