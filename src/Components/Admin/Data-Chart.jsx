import React from 'react'
import { Layout } from 'antd';

import Menu from './Menu';
import {adressIp} from '../../config';
import NavHeader from './Nav';

const { Sider, Content } = Layout;

function DataChart() {
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Sider width={256}>
                    <Menu keySelected='5' /> 
                </Sider>
                <Content className='container-content'>
                    
                </Content>
            </Layout>
        </Layout>
    );
}

export default DataChart