import React, {useState, useEffect} from 'react'
import {Icon, Badge } from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    Navbar,
    Nav,
    NavItem,
    UncontrolledDropdown,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';

import {adressIp} from '../config';


function Header(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [nbItemPanier, setNbItemPanier] = useState(0);
    const [prixPanier, setPrixPanier] = useState(0.00);


    const toggle = () => setDropdownOpen(prevState => !prevState);
    
    //Permet de mettre a jour le infos du panier sur le header
    useEffect(() => {
        if(props.userPanier) {
            setNbItemPanier(props.userPanier.length)
        }
        fetch(`http://${adressIp}:3000/dataHeaderPanier?userToken=${props.userToken}`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas.result && datas.result.panier) {
                console.log('Panier qui vient du back', datas.result.panier)
                var prixTotal = 0;
                for(var i = 0; i < datas.result.panier.length; i++) {
                    prixTotal += datas.result.panier[i].price;
                }
                setPrixPanier(prixTotal);
            } else {
                console.log('PROBLEME AVEC USER (HEADER)');
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [props.userPanier, props.productList])

    //fonction qui permet de deconnecter le user (appel de la route back, et des fonctions pour le reducer)
    var handleLogout = () => {
        fetch(`http://${adressIp}:3000/users/logout`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            withCredentials: true,
            credentials: 'include',
        })
        .then(response => {
            return response.json();
        })
        .then(datas => {
            console.log('My cookie',datas.cookie)
        })
        .catch(err => {
            console.log(err)
        })

        props.logout()
        props.userConnected(false)
    }

    //Dropdown qui change en fonction du status du user (connecter ou non)
    let myDropdown
    if(props.userIsConnected) {
        myDropdown = 
            <DropdownMenu style={{width: '15em'}}>
                <DropdownItem className='text-center'><Link to="/signin" >Je suis connecter</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem header className='text-center' style={{fontSize: '12px'}}> <a onClick={() => handleLogout()}> Déconnexion </a> </DropdownItem>
            </DropdownMenu>
        
      } else {
        myDropdown = 
            <DropdownMenu style={{width: '15em'}}>
                <DropdownItem className='text-center'><Link to="/signin" >Se Connecter</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem header className='text-center' style={{fontSize: '12px'}}><Link to="/signup" >Pas de compte? Créez-en un</Link></DropdownItem>
            </DropdownMenu>
      }

    return (
        <div className='containerHeader'>
            <Navbar expand="md" className='navBarHeader'>
                <Nav className="mr-auto">
                    <NavItem>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                                Francais
                            </DropdownToggle>
                        </UncontrolledDropdown>
                    </NavItem>
                    <NavItem>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                                EUR
                            </DropdownToggle>
                        </UncontrolledDropdown>
                    </NavItem>
                </Nav>
                <NavbarText className='navBarText'>Contact Us</NavbarText>
                <NavbarText className='navBarText'>Subscribe</NavbarText>
                <NavbarText className='navBarText'>Subscribe</NavbarText>
                <NavbarText className='navBarText'>Subscribe</NavbarText>
            </Navbar>
            <Navbar color="light" light expand="md" style={{height: '60%'}}>
                <Nav className="mr-auto" navbar >
                    <Icon type="menu" style={{fontSize:'30px', marginLeft:'0.5em'}}/>
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
                        <Link to='/Panier'>
                            <p className='textPanierHeader'> Votre panier</p>
                        </Link>
                        <p className='textPanierHeader'>{prixPanier} €</p>
                        </div>
                </NavbarText>
            </Navbar>                    
        </div>
    );
}

function mapStateToProps(state) {
    console.log('My ', state);
    return {
        userIsConnected: state.UserConnected,
        userToken: state.User.token,
        userPanier: state.User.panier
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