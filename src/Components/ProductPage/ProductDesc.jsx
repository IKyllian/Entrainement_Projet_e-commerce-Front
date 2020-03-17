import React from 'react'; 
import { Row, Col } from 'reactstrap';
import {Rate, Button } from 'antd';
import ReactImageMagnify from 'react-image-magnify'

import DisplayStock from './DisplayStock';
import SkeletonDesc from './SkeletonDesc';

const itemsImage = [
    {
      original: "https://placeimg.com/640/480/any/1",
      thumbnail: "https://placeimg.com/250/150/any/1"
    },
    {
      original: "https://placeimg.com/640/480/any/2",
      thumbnail: "https://placeimg.com/250/150/any/2"
    },
    {
      original: "https://placeimg.com/640/480/any/3",
      thumbnail: "https://placeimg.com/250/150/any/3"
    }
  ]

function ProductDesc({product, addFunction, buttonDisable, isLoad}) {
    const handleAdd = (id, price) => {
        addFunction(id, price);
    }
    if(!isLoad) {
        return(
            <div style={{marginTop: '1em'}}>
                <Row>
                    <Col md='5'>
                        <div className= 'fluid__image-container text-center'>
                            {
                                product.images &&
                                    <ReactImageMagnify {...{
                                        smallImage: {
                                            alt: 'Image of the product',
                                            isFluidWidth: true,
                                            src: product.images[0]
                                        },
                                        largeImage: {
                                            src: product.images[0],
                                            width: 1100,
                                            height: 1200
                                        },
                                        enlargedImagePosition: 'over'
                                    }} />
                            }
                            {/* <img className='imgProduct' src={product.images} alt='Produit du produit' /> */}
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