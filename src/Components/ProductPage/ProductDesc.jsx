import React from 'react'; 
import { Row, Col } from 'reactstrap';
import {Rate, Button } from 'antd';
import DisplayStock from './DisplayStock';
import SkeletonDesc from './SkeletonDesc'
import { useEffect } from 'react';

function ProductDesc({product, addFunction, buttonDisable, isLoad}) {
    const handleAdd = (id, price) => {
        addFunction(id, price);
    }
    if(!isLoad) {
        return(
            <div style={{marginTop: '1em'}}>
                <Row>
                    <Col md='5'>
                        <div className= 'text-center'>
                            {/* <ReactImageMagnify className='imgProduct' {...{
                                smallImage: {
                                    alt: 'Wristwatch by Ted Baker London',
                                    isFluidWidth: true,
                                    src: product.images
                                },
                                largeImage: {
                                    src: product.images,
                                    width: 1200,
                                    height: 1800
                                }
                            }} /> */}
                            <img className='imgProduct' src={product.images} alt='Produit du produit' />
                        </div>
                    </Col>
                    <Col md={{size: 7, offset: 0}} xs={{size: 10, offset: 1}}>
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
    } else {
        return(
            <div style={{marginTop: '1em'}}>
                <Row>
                    <Col md='5'>
                    </Col>
                    <Col md={{size: 7, offset: 0}} xs={{size: 10, offset: 1}}>
                        <SkeletonDesc product={product} isLoad={isLoad} />
                    </Col>
                </Row>
            </div>
        );
    }
    
}

export default ProductDesc