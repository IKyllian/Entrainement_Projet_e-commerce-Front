import React from 'react';
import { Col } from 'reactstrap';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function CardAddressForm({addressObject, addressNumber, addFunction }) {
    const handleClick = () => addFunction();
    if(addressObject && addressObject.address) {
        return (
            <Col> 
                <div className='container-item-address'>
                    <h5> Adresse de {addressNumber === 1 ? 'domicile' : 'secondaire'} </h5>
                    <div className='address-info'>
                        <p> <span className='label-address'> Nom </span> : {addressObject.name}</p>
                        <p> <span className='label-address'> Adresse </span> : {addressObject.address}</p>
                        {
                            addressObject.additionalAddress && addressObject.additionalAddress !== '' &&
                            <p> <span className='label-address'> Complément d'adresse </span> : {addressObject.additionalAddress}</p>
                        }
                        <p> <span className='label-address'> Ville </span> : {addressObject.city} </p>
                        <p> <span className='label-address'> Code Postal </span> : {addressObject.zipCode}</p>
                    </div>
                    <Link to='/PaymentConfirm'>
                        <Button className='button-choose-address' type='primary' onClick={() => handleClick()}> Choisir </Button>
                    </Link>
                </div>   
            </Col>
        );
    } else {
        return null
    }
}

export default CardAddressForm