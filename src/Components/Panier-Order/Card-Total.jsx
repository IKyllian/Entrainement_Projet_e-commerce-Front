import React from 'react';
import { Icon } from 'antd';

function CardTotal({productsPrice, deliveryPrice, totalPrice, buttonDisplay, discountCoupon, _deleteDiscount}) {
    const handleClick = () => {
        _deleteDiscount();
    }
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
                {
                    discountCoupon &&
                    <div className='delivery-total'>
                        Réduction  
                        <span className='amount'> -{discountCoupon} € </span>
                        {
                            _deleteDiscount &&
                            <Icon type="close" className='icon-delete-discount' onClick={() => handleClick()} />
                        }
                    </div>
                }
                <hr />
                <div className='order-total'>
                    Total  
                    <span className='amount'> {discountCoupon ? totalPrice - discountCoupon : totalPrice} € </span>
                </div>
                {buttonDisplay}
            </div>
        </div>
    );
}

export default CardTotal