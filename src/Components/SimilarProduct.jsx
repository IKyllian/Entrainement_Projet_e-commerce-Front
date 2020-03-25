import React from 'react'
import { Row, Col, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Rate, Empty, Divider } from 'antd';
import Slider from "react-slick";
import { Link } from 'react-router-dom';

function SimilarProduct({similarProducts, type}) {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 750,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    let similarProductsList;

    if(similarProducts && similarProducts.length < 1) {
        similarProductsList = 
            <>
                <h2 className='titleStratProduct'> Produits {type === 1 ? 'les plus vendus' : 'similaires'} </h2>
                <Empty style={{marginTop: '3em'}} image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Pas de produits ${type === 1 ? 'les plus vendus' : 'similaires'}`} />
                <Link to='/Catalogue'>
                        <p className='text-center' style={{marginBottom: '3em'}}> Aller au catalogue </p>                                     
                </Link>
            </>
    } else {
        similarProductsList = 
            <div className='stratProduct'>
                <h2 className='titleStratProduct'> Produits {type === 1 ? 'les plus vendus' : 'similaires'} </h2>
                <Divider className='divider-products-list' />
                <div>
                    <Row>
                        <Col xs={{size: 10, offset: 1}} sm={{size: 10, offset: 1}}>
                            <Slider {...settings}>
                                {
                                    similarProducts.map((element, i) => (
                                        <Col key={i} >
                                            <Card className='cardProduct' >
                                                <Link to={`/Product/${element._id}`}>
                                                    <img width="90%" className='cardImage' src={element.images[0]} alt="Card cap" />
                                                </Link>
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
                            </Slider>
                        </Col>
                    </Row>
                </div>
                <Link to='/Catalogue'>
                    <p className='text-center link-catalogue'> Aller au catalogue </p>                                     
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