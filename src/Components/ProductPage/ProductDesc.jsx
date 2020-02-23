import React from 'react'; 
import { Row, Col } from 'reactstrap';
import {Rate, Button } from 'antd';
import DisplayStock from './DisplayStock';

function ProductDesc({product, addFunction, buttonDisable}) {
    const handleAdd = (id, price) => {
        addFunction(id, price);
    }
    return(
        <div style={{marginTop: '1em'}}>
            <Row>
                <Col md='5'>
                    <div className= 'text-center'>
                        <img className='imgProduct' src={product.images} alt='Produit du produit' />
                    </div>
                </Col>
                <Col md='7'>
                    <div className='containerProduct'>
                        <h3> {product.name} </h3>
                        <DisplayStock productStock={product.stock} />
                        <div style={{marginBottom: '0.5em'}}>
                            <Rate allowHalf disabled value={product.note} />
                            <p className='nb-avis-product'> ({product.comments ? product.comments.length : 'err'} avis) </p>
                        </div>
                        <h5> {product.price} € </h5>
                        <div className='descProduct'>
                            <p> {product.description} </p>
                        </div>
                        <Button type='primary' size='large' style={{width: '11em'}} onClick={() => handleAdd(product._id, product.price)} disabled={buttonDisable}> Ajouter au panier </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default ProductDesc