import React from 'react'; 
import { Icon } from 'antd';

function DisplayStock({productStock}) {
    return(
        <p> {productStock < 1 ? 'Produit plus en stock' : 'En stock'}  <Icon type={productStock < 1 ? 'close-circle' : 'check-circle'} theme="twoTone" twoToneColor={productStock < 1 ? 'red' : '#52c41a'} style={{verticalAlign: 'baseline'}} /> </p>
    );
}

export default DisplayStock