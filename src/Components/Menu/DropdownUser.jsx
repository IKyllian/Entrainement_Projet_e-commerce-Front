import React from 'react'
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownItem } from 'reactstrap';

function DropdownUser({userIsConnected, userLastName, handleLogout}) {
    const logout = () => {
        handleLogout();
    }
    if(userIsConnected) {
        return(
            <DropdownMenu className='dropdownUser' style={{width: '15em'}}>
                <p className='text-center pDropdown'> Bonjour {userLastName} ! </p>
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
                <DropdownItem header className='text-center' style={{fontSize: '12px'}}> <p onClick={() => logout()} className='logout'> Déconnexion </p> </DropdownItem>
            </DropdownMenu>
        );
    } else {
        return (
            <DropdownMenu className='dropdownUser' style={{width: '15em'}}>
                <Link to={{pathname: '/Signin', state: {linkFrom: 'header'} }}>
                    <DropdownItem className='text-center'>Se Connecter</DropdownItem>
                </Link>
                <DropdownItem divider />
                <Link to='/Signup' >
                    <DropdownItem className='text-center' style={{fontSize: '12px'}}>Pas de compte? Créez-en un</DropdownItem>
                </Link>
            </DropdownMenu>
        );
    }
}

export default DropdownUser