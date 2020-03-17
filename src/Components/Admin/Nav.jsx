import React from 'react'
import { Layout } from 'antd';
import {adressIp} from '../../config';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

const { Header } = Layout; 

function Nav(props) {
    var handleLogout = () => {
        fetch(`http://${adressIp}:3000/users/logout`, {
            withCredentials: true,
            credentials: 'include',
        })
        props.logout()
        props.userConnected(false)
    }
    return (
        <Header className='header-admin'>
            <div className='container-header-admin'>
                <h5 className='title-header-admin'> Admin Interface </h5>
                <div>
                <p className='float-right logout-admin' onClick={() => handleLogout()}> Deconnexion </p>
                <Link to='/'><p className='float-right logout-admin mr-2'>  Retour au site -  </p></Link>

                </div>
            </div>
            
        </Header>
    );
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
    null, 
    mapDispatchToProps
)(Nav);