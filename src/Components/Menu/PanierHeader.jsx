import React from 'react'
import { Empty , Badge, Icon} from 'antd';

function PanierHeader({items, productsQuantity, deleteFunction}) {
    const handleDelete = (i, price) => deleteFunction(i, price);

    if(items && items.length > 0) {
        return (
            items.map((element, index) => (
                <li className='items-product-list' key={index}>
                    <Badge count={productsQuantity[index]}>
                        <div className='img-product-list-header' style={{backgroundImage: `url(${element.images})`}}> </div>
                    </Badge>
                    <div className='product-info-menu'>
                        <h6 className='title-product-list'> {element.name} </h6>
                    </div>
                    <div className='price-info'>
                        <h6 className='price-bold'> {element.price} €</h6>
                    </div>
                    <div className='delete-button'>
                        <Icon type="delete" theme="filled" style={{fontSize:'18px'}} onClick={() => handleDelete(index, element.price)} />
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