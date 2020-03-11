import React from 'react'
import { Layout } from 'antd';

const { Header } = Layout; 

function Nav() {
    return (
        <Header className='header-admin'>
            <h5 className='title-header-admin'> Admin Interface </h5>
        </Header>
    );
}

export default Nav