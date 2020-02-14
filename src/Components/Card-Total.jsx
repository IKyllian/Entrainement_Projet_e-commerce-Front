import React from 'react';

function CardTotal({productsPrice, deliveryPrice, totalPrice, buttonDisplay}) {
    console.log(productsPrice)
    return (
        <div className='container-total'>
            <div className='total'>
                <div className='product-total'>
                    Produits  
                    <span className='amount'> {productsPrice} € </span>
                </div>
                <div className='delivery-total'>
                    Livraison  
                    <span className='amount'> {deliveryPrice} € </span>
                </div>
                <hr />
                <div className='order-total'>
                    Total  
                    <span className='amount'> {totalPrice} € </span>
                </div>
                {buttonDisplay}
            </div>
        </div>
    );
}

export default CardTotal