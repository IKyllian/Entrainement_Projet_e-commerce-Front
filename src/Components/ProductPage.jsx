import React, {useEffect, useState} from 'react'; 
import Header from './Header';
import { Container, Row, Col } from 'reactstrap';
import { Icon } from 'antd';
import { Button } from 'reactstrap';
import { Breadcrumb } from 'antd';
import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';
import { Tabs } from 'antd';
import Footer from './Footer';
import SimilarProduct from './SimilarProduct'
import {adressIp} from '../config';
import {connect} from 'react-redux';


const { TabPane } = Tabs;

function ProductPage(props) {
    const [product, setProduct] = useState({})

    useEffect(() => {
        fetch(`http://${adressIp}:3000/product?id=${props.match.params.id}`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            setProduct(datas.product);
        })
        .catch(err => {
            console.log(err);
        })
    }, [props.match.params.id])


    var addProduct = (productId) => {
        props.addProduct(productId);

        fetch(`http://${adressIp}:3000/addProduct`,
        {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `idProduct=${productId}&userToken=${props.userToken}` //Envoie l'id du produit et le token du user
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
        })
        .catch(function(err) {
            console.log(err);
        })
    }


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
    return (
        <Container style={homeStyle}>
            <Header />
            <div style={{marginLeft: '2em', marginTop: '0.5em'}}>   
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
            </div>
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
                            <div style={{display: 'flex', flexDirection: 'row', marginBottom: '0.5em'}}>
                                <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                <Icon type="star" style={starsProduct} theme="twoTone" twoToneColor='#ffce0a'/>
                                <Icon type="star" style={starsProduct}/>
                                <Icon type="star" style={starsProduct}/>
                            </div>
                            <h5> {product.price} € </h5>
                            <div className='descProduct'>
                                <p> {product.description} </p>
                            </div>
                            <Button style={{width: '11em'}} onClick={() => addProduct(product._id)}> Ajouter au panier  </Button>
                        </div>
                    
                    </Col>
                </Row>
            </div>


            <SimilarProduct />

            <div className='containerTabs'>                
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Avis" key="1">
                        <Row>
                            <Col md={{size: 10, offset: 1}}>
                                <Comment
                                    author={<p>Han Solo</p>}
                                    avatar={
                                    <Avatar
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                        alt="Han Solo"
                                    />
                                    }
                                    content={
                                    <p>
                                        We supply a series of design principles, practical patterns and high quality design
                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                        and efficiently.
                                    </p>
                                    }
                                    datetime={
                                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                        <span>{moment().fromNow()}</span>
                                    </Tooltip>
                                    }
                                />
                                <Comment
                                    author={<p>Han Solo</p>}
                                    avatar={
                                    <Avatar
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                        alt="Han Solo"
                                    />
                                    }
                                    content={
                                    <p>
                                        We supply a series of design principles, practical patterns and high quality design
                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                        and efficiently.
                                    </p>
                                    }
                                    datetime={
                                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                        <span>{moment().fromNow()}</span>
                                    </Tooltip>
                                    }
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Photos" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </div>

            <Footer /> 
        </Container>
    );
}

function mapStateToProps(state) {
    console.log('My state', state)
    return {
        userToken: state.User.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProduct: function(idProduct) {
            dispatch({
                type: 'addProduct',
                idProduct: idProduct
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ProductPage)