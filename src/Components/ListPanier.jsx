import React from 'react';
import { InputNumber, Icon, Empty } from 'antd';

function ListPanier({userPanier, deleteFunction}) {
    const handleDelete = (index, price) => deleteFunction(index, price);
    if(userPanier && userPanier.length > 0) {
        return (
            userPanier.map((element, i) => (
                <li className='items-product-list' key={i}>
                    <div className='img-product-list' style={{backgroundImage: `url(${element.images})`}} >  </div>
                    <div className='product-info' >
                        {/* <Link> */}
                            <h5 className='title-product-list'> {element.name} </h5>
                        {/* </Link> */}
                        <p className='attribute-product-list'> Type: {element.type} </p>
                        <h6> {element.price} € </h6>
                    </div>
                    <div className='input-number'>
                        <InputNumber size="large" min={1} max={10} defaultValue={1} />
                    </div>
                    <div className='price-info'>
                        <h6 className='price-bold'> {element.price} €</h6>
                    </div>
                    <div className='delete-button' >
                        <Icon type="delete" theme="filled" style={{fontSize:'25px'}} onClick={() => handleDelete(i, element.price)} />
                    </div>
                </li>
            ))     
        )
    } else {
        return (
            <Empty style={{padding: '1em'}} description={'Vous n\'avez pas de produit dans votre panier :('} />
        );
    }
}

export default ListPanier