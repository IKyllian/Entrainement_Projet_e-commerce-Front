import React from 'react'
import { Row, Col, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Rate, Empty } from 'antd';
import { Link } from 'react-router-dom';

function SimilarProduct({similarProducts, type}) {
    let similarProductsList;

    if(similarProducts && similarProducts.length < 1) {
        similarProductsList = 
            <>
                <Empty style={{marginTop: '3em'}} image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Pas de produits ${type === 1 ? 'les plus vendus' : 'similaires'}`} />
                <Link to='/Catalogue'>
                        <p className='text-center' style={{marginBottom: '3em'}}> Aller au catalogue </p>                                     
                </Link>
            </>
    } else {
        similarProductsList = 
            <div className='stratProduct'>
                <h2 className='titleStratProduct'> Produits {type === 1 ? 'les plus vendus' : 'similaires'} </h2>
                <div className='containerList'>
                <Row>
                        {
                            similarProducts.map((element, i) => (
                                <Col key={i}>
                                    <Card className='cardProduct' >
                                        <Link to={`/Product/${element._id}`}>
                                            <img width="90%" className='cardImage' src={element.images[0]} alt="Card cap" />
                                        </Link>
                                        <CardBody>
                                            <div style={{marginBottom: '0.5em'}}>
                                                <Rate allowHalf disabled defaultValue={element.note} />
                                            </div>
                                            <CardTitle className='titleCard'>{element.name}</CardTitle>
                                            <CardText className='priceCard'>{element.price} € </CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))
                        }
                </Row>
                </div>
                <Link to='/Catalogue'>
                    <p className='text-center' style={{marginBottom: '3em'}}> Aller au catalogue </p>                                     
                </Link>
            </div>
    }
    return(
        <>
           {similarProductsList}
        </>
    );
}

export default SimilarProduct