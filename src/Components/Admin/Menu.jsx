import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
const { SubMenu } = Menu;

function MenuAdmin({keySelected}) {
    return (
        <Menu
        className='menu-admin'
        style={{ width: 256 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[keySelected]}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="mail" />
              <span>Panel Admin</span>
            </span>
          }
        >  
            <Menu.Item key='1'><Link to='/AdminUserList'> Liste des Utilisateurs </Link> </Menu.Item>
            <Menu.Item key='2'><Link to='/AdminProductsList'> Liste des Produits </Link></Menu.Item>
            <Menu.Item key='3'><Link to='/AdminOrdersList'> Liste des Commandes  </Link></Menu.Item>
            <Menu.Item key='4'><Link to='/AdminAddProduct'> Ajouter un produit  </Link></Menu.Item>
            <Menu.Item key='5'><Link to='/AdminDataChart'> Graphiques des données  </Link></Menu.Item>
        </SubMenu>
      </Menu>

    );
}

export default MenuAdmin