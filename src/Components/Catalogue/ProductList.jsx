import React from 'react'; 
import { Row, Col, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Rate } from 'antd';
import { Link } from 'react-router-dom';

function ProductList({productList}) {
    return(
        <Row md='3' sm='2' xs='2'>
            {
                productList.map((element, i) => (
                    <Col key={i}>
                        <Card className='product-card'>
                            <div className='container-image-card text-center'>
                                <Link to={`/Product/${element._id}`}>
                                    <img width="60%" className='image-card' src={element.images} alt="Card cap" />
                                </Link>
                            </div>
                            <CardBody>
                            <div style={{marginBottom: '0.5em'}}>
                                <Rate allowHalf disabled defaultValue={element.note} />
                                <p className='nb-avis-product'> ({element.comments.length} avis) </p>
                            </div>
                            <CardTitle className='titleCard'>{element.name}</CardTitle>
                                <CardText className='priceCard'>{element.price} € </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                ))
            } 
        </Row>
    );
}

export default ProductList