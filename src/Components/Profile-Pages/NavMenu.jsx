import React from 'react';
import { Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

function ProfilPageMenu(props) {
    return(
        <div style={{backgroundColor: '#fcfcfc'}}>
            <div className='top-menu-info text-center'>
                <Avatar size={130} icon="user" className='avatar-top-menu-info' />

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
               
                <Menu.Item key="3">Nous contacter</Menu.Item>

            </Menu>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        userFirstName : state.User.firstName,
        userLastName : state.User.lastName,
        
    }
}

export default connect(
    mapStateToProps, 
    null
)(ProfilPageMenu)