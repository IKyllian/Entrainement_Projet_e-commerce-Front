import React from 'react'
import {
    Navbar,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    NavbarText
} from 'reactstrap';
import { Link } from 'react-router-dom';

function NavHeader() {
    return (
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
            <NavbarText className='navBarText'> <Link to='ContactForm'> Contact Us </Link></NavbarText>
            <NavbarText className='navBarText navBarTextResponsive'>Subscribe</NavbarText>
            <NavbarText className='navBarText navBarTextResponsive'>Subscribe</NavbarText>
            <NavbarText className='navBarText navBarTextResponsive'>Subscribe</NavbarText>
        </Navbar>
    );
}

export default NavHeader