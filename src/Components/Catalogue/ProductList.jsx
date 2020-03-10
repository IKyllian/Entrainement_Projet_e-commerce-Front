import React, { useState } from 'react'; 
import { Row, Col, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Rate, Pagination } from 'antd';
import { Link } from 'react-router-dom';

function ProductList({productList}) {
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(6)

    const handleChange = (value) => {
        console.log('value', value);
        //Permet si on passe a la page suivante de passer a la suite dans le tableau des produits
        if(value <= 1) {
            setMinValue(0);
            setMaxValue(6);
        } else {
            setMinValue(maxValue);
            setMaxValue(value * 6);
        }
    }   
    return(
        <Row md='3' sm='2' xs='2'>
            {productList &&
                productList.length > 0 &&
                productList.slice(minValue, maxValue).map((element, i) => (
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
            <Col xs={{size: 8, offset: 4}}  sm={{size: 7, offset: 5}} >
                <Pagination defaultCurrent={1} defaultPageSize={6} onChange={handleChange} total={productList.length} />
            </Col>
        </Row>
    );
}

export default ProductList