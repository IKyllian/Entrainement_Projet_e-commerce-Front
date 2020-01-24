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
        <Container style={homeStyle}>
            <Header />
            <div style={{marginLeft: '2em', marginTop: '0.5em'}}>   
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row md='2' style={{width: '100%', marginTop: '1em'}}>
                <Col md='3'>
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
                        <div style={{marginLeft: '1em', marginTop: '1em'}}>
                            <h6> Prix </h6>
                            <Slider range defaultValue={[0, 500]} max={500} marks={marks} />
                        </div>
                    </div>
                    
                </Col>

                <Col md='9'>
                    <div className='stratProduct' style={{marginBottom: '2em'}}>
                        <h2 className='titleStratProduct'> Catalogue </h2>
                        <div className='containerList'>
                            <Row>
                                {
                                    products.map((element, i) => (
                                        <Col key={i}>
                                            <Card className='cardProduct' style={{marginBottom : '1em'}}>
                                                <Link to={`/Product/${element._id}`}>
                                                    <img width="90%" className='cardImage' src={element.images} alt="Card cap" />
                                                </Link>
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