import React from 'react';
import { Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

function ProfilPageMenu(props) {
    return(
        <div style={{backgroundColor: '#fcfcfc'}}>
            <div className='top-menu-info text-center'>
                <Avatar size={130} style={{backgroundColor: props.backgroundProfil, verticalAlign: 'middle', fontSize: '40px'}} className='avatar-top-menu-info' >
                    {props.userLastName.split('')[0]}
                </Avatar>
                {/* <div className='img-top-menu-info' style={{backgroundImage: `url(${ProfilPic})`}}> </div> */}
                <h6> {props.userFirstName} {props.userLastName} </h6>
            </div>
            <Menu
                className='menu-profil'
                defaultSelectedKeys={['1']}
                selectedKeys={[props.item]}
                mode="inline"
            >
                
                    <Menu.Item key="1"><Link to='/ProfilPage'>Informations du compte </Link></Menu.Item>
                
                
                    <Menu.Item key="2"><Link to='/ProfilPageOrders'>Mes commandes  </Link></Menu.Item>
               
                <Menu.Item key="3"><Link to='/ContactForm'>Nous contacter </Link></Menu.Item>

            </Menu>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        userFirstName : state.User.firstName,
        userLastName : state.User.lastName,
        backgroundProfil: state.User.background_profil
    }
}

export default connect(
    mapStateToProps, 
    null
)(ProfilPageMenu)