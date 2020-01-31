import React from 'react'
import {Row, Col, Card, CardText, CardBody, CardTitle} from 'reactstrap';
import { Icon } from 'antd';
import {Link} from 'react-router-dom';


import ImageProduct from '../Images/product1.jpg'
import ImageProduct2 from '../Images/product2.jpg'
import ImageProduct3 from '../Images/product3.jpg'

function SimilarProduct() {
    var starsProduct = {
        fontSize: '13px',
        marginRight: '2px',
        color: 'grey'
    }
    
    return(
        <div className='stratProduct'>
            <h2 className='titleStratProduct'> Produits les plus vendus </h2>
            <div className='containerList'>
                <Row>
                    <Col>
                        <Card className='cardProduct'>
                            <img width="90%" className='cardImage' src={ImageProduct} alt="Card cap" />
                            <CardBody>
                                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '0.5em'}}>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct}/>
                                    <Icon type="star" style={starsProduct}/>
                                </div>
                                <CardTitle className='titleCard'>Faber-Castell 110088 Set de crayons de couleur</CardTitle>
                                <CardText className='priceCard'>140 € </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cardProduct'>
                            <Link to='/Product'>
                                <img width="90%" className='cardImage' src={ImageProduct2} alt="Card cap" />
                            </Link>
                            <CardBody>
                                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '0.5em'}}>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct}/>
                                    <Icon type="star" style={starsProduct}/>
                                </div>
                                {/* <Link to='/Product' style> */}
                                    <CardTitle className='cardTitle'>Crayon Pitt de Faber Castell</CardTitle>
                                {/* </Link> */}
                                <CardText className='cardPrice' >40 € </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cardProduct'>
                            <img width="90%" className='cardImage' src={ImageProduct3} alt="Card cap" />
                            <CardBody>
                                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '0.5em'}}>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct}/>
                                    <Icon type="star" style={starsProduct}/>
                                </div>
                                <CardTitle className='cardTitle'>Pro Marker</CardTitle>
                                <CardText className='cardPrice'>50 € </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cardProduct'>
                            <img width="90%" className='cardImage' src={ImageProduct3} alt="Card cap" />
                            <CardBody>
                                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '0.5em'}}>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                    <Icon type="star" style={starsProduct}/>
                                    <Icon type="star" style={starsProduct}/>
                                </div>
                                <CardTitle className='cardTitle'>Pro Marker</CardTitle>
                                <CardText className='cardPrice'>50 € </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
                
            <Link to='/Catalogue'>
                <p className='text-center' style={{marginBottom: '3em'}}> Aller au catalogue </p>                                     
            </Link>
        </div>

    );
}


export default SimilarProduct