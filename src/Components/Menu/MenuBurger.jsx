import React from 'react'
import { Drawer } from 'antd';
import { Link } from 'react-router-dom'

function MenuBurger({drawerState, onClose, handleLogout, userRole}) {
    const handleClose = () => {
        onClose()
    }

    const logout = () => {
        handleLogout();
    }
    return (
        <Drawer    
            closable={false}
            onClose={handleClose}
            visible={drawerState}
            placement= 'left'
            width={290}
        >
            <div>
            {
                userRole && userRole === 'admin' &&
                <Link to='/AdminUserList'>
                    <p className='p-burger'> Admin Interface </p>
                </Link>
            }
                <Link to='/'>
                    <p className='p-burger'> Accueil </p>
                </Link>
                <Link to='/Catalogue'>
                    <p className='p-burger'> Catalogue </p>
                </Link>
            </div>
            <div className='elements-burger-responsive'>
                <Link to='/ProfilPage'>
                    <p className='p-burger'>  Mon profil </p>
                </Link>
                <Link to='/Panier'>
                    <p className='p-burger'>  Mon Panier </p>
                </Link>
                <p className='burger-logout' onClick={() => logout()}> Déconnexion </p>
            </div>
            
        </Drawer>
        
    );
    
}

export default MenuBurger