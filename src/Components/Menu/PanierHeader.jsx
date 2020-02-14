import React from 'react'
import { Empty } from 'antd';

function PanierHeader({items}) {
    console.log('azeaze',items);
    if(items && items.length > 0) {
        return (
            items.map((element, index) => (
                <li className='items-product-list' key={index}>
                    <div className='img-product-list-header' style={{backgroundImage: `url(${element.images})`}}> </div>
                    <div className='product-info'>
                        <h6 className='title-product-list'> {element.name} </h6>
                    </div>
                    <div className='price-info'>
                        <h6 className='price-bold'> {element.price} €</h6>
                    </div>
                </li>
            ))
        );   
    } else {
        return (
            <Empty style={{padding: '1em'}} description={'Oups! Vous n\'avez pas de produit dans votre panier'} />
        );
    }
}

export default PanierHeader;