import React, { useState } from 'react';
import { Menu, Icon, Layout} from 'antd';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import { useEffect } from 'react';

const { SubMenu } = Menu;
const { Sider } = Layout;

function MenuAdmin(props) {    
    const onCollapse = () => props.handleCollapse();

    return (
      <Sider width={256} collapsible collapsed={props.collapsed}  onCollapse={() => onCollapse()}>
        <Menu
          className='menu-admin'
          style={{ width: 256 }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[props.keySelected]}
          mode="inline"
        >
          <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>Panel Admin</span>
                </span>
              }
          >  
            <Menu.Item key='1'><Link to='/AdminUserList'> Liste des Utilisateurs </Link> </Menu.Item>
            <Menu.Item key='2'><Link to='/AdminProductsList'> Liste des Produits </Link></Menu.Item>
            <Menu.Item key='3'><Link to='/AdminOrdersList'> Liste des Commandes  </Link></Menu.Item>
            <Menu.Item key='4'><Link to='/AdminAddProduct'> Ajouter un produit  </Link></Menu.Item>
            <Menu.Item key='5'><Link to='/AdminDataChart'> Graphiques des données  </Link></Menu.Item>
            <Menu.Item key='6'><Link to='/AdminMessagesList'> Liste des messages  </Link></Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

    );
}

function mapStateToProps(state) {
  return{
      collapsed: state.MenuAdmin.collapsed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleCollapse: function() {
        dispatch({
            type: 'onCollapse',
        })
    },
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(MenuAdmin);