import React, {useEffect, useState} from 'react'; 
import Header from './Header';
import Footer from './Footer';
import { Container, Row, Col } from 'reactstrap';
import { Card, CardText, CardBody, CardTitle} from 'reactstrap';
import { Icon } from 'antd';
import { Slider } from 'antd';
import { Breadcrumb } from 'antd';
import { Tree } from 'antd';
import { Pagination } from 'antd';
import {Link} from 'react-router-dom';

import {adressIp} from '../config';

const { TreeNode } = Tree;

function Catalogue() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/getProducts`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            console.log('My datas',datas);
            setProducts(datas.products);
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    var homeStyle = {
        margin: 0,
        padding: 0,
        minWidth: '100vw'
    }

    var starsProduct = {
        fontSize: '13px',
        marginRight: '2px',
        color: 'grey'
         
    }

    const marks = {
        0: '5€',
        500: '500€'
    }

    return (
        <Container fluid={true}>
            <Header />
            <div style={{marginLeft: '2em', marginTop: '0.5em'}}>   
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row style={{width: '100%', marginTop: '1em'}}>
                <Col lg='3' >
                    <div style={{marginTop: '1em', marginLeft: '2em'}}>
                        <h4> Filtrer par </h4>
                        <Tree
                            checkable
                            defaultExpandedKeys={['0-0-0', '0-0-1']}
                            defaultCheckedKeys={['0-0']}
                        >
                            <TreeNode title="Type de Produits" key="0-0">
                                <TreeNode title="Crayons de couleurs" key="0-0-0" />
                                <TreeNode title="Crayons à papier" key="0-0-1" />
                                <TreeNode title="Pinceaux" key="0-0-2" />
                                <TreeNode title="Papier" key="0-0-3" />
                            </TreeNode>
                        </Tree>
                        <div className='price-filter'>
                            <h6> Prix </h6>
                            <Slider range defaultValue={[0, 500]} max={500} marks={marks} />
                        </div>
                    </div>
                </Col>

                <Col >
                    <div className='container-product'>
                        <h2 className='titleStratProduct'> Catalogue </h2>
                        <div>
                            <Row md='3' sm='2' xs='2'>
                                {
                                    products.map((element, i) => (
                                        <Col key={i}>
                                            <Card className='product-card'>
                                                <div className='container-image-card text-center'>
                                                    <Link to={`/Product/${element._id}`}>
                                                        <img width="60%" className='image-card' src={element.images} alt="Card cap" />
                                                    </Link>
                                                </div>
                                                
                                                <CardBody>
                                                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '0.5em'}}>
                                                        <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                                        <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                                        <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                                        <Icon type="star" style={starsProduct}/>
                                                        <Icon type="star" style={starsProduct}/>
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
                        <Pagination className='text-center' defaultCurrent={1} total={6} />
                    </div>
                    
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}

export default Catalogue;