import React from 'react';
import { Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

function SpinLoad() {
    return(
        <Spin className='page-load' indicator={antIcon} />
    );
}

export default SpinLoad