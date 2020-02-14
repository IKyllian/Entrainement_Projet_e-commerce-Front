import React from 'react'
import {
    Navbar,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    NavbarText
  } from 'reactstrap';

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
            <NavbarText className='navBarText'>Contact Us</NavbarText>
            <NavbarText className='navBarText'>Subscribe</NavbarText>
            <NavbarText className='navBarText'>Subscribe</NavbarText>
            <NavbarText className='navBarText'>Subscribe</NavbarText>
        </Navbar>
    );
}

export default NavHeader