import React, {useEffect, useState, Fragment} from 'react'; 
import { Container, Row, Col } from 'reactstrap';
import {Breadcrumb, Comment, Tooltip, Avatar, Tabs, Rate, Button, Modal, Input, Form, Upload, Icon} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';

import {adressIp} from '../config';
import Header from './Header';
import Footer from './Footer';
import SimilarProduct from './SimilarProduct'
import { Redirect } from 'react-router-dom';

const { TabPane } = Tabs;
const { TextArea } = Input;

function ProductPage(props) {
    const [product, setProduct] = useState({});
    const [commentsList, setCommentsList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [titleComment, setTitleComment] = useState('');
    const [messageComment, setMessageComment] = useState('');
    const [noteComment, setNoteComment] = useState();
    const [imagesComment, setImagesComment] = useState([]);
    const [redirectModal, setRedirectModal] = useState(false)//Sert a redirect si le user est pas connecter et qu'il veut ajouter un avis 
    const [fileList, setFileList] = useState([]);

    const [test, setTest] = useState(0);
    
    useEffect(() => {
        //Permet, au chargement de la page, d'aller chercher en base de donnée le produit correspondant a l'id envoyer 
        fetch(`http://${adressIp}:3000/product?id=${props.match.params.id}`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            console.log(datas)
            setProduct(datas.result);
            setCommentsList(datas.result.comments);
        })
        .catch(err => {
            console.log(err);
        })
    }, [test])

    const beforeUpload = (file) => {
        console.log('file', file);
        let files = [];
        const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => {
                    file.thumbUrl = e.target.result;
                    files.push(file);
                    setFileList(fileList => fileList.concat([...files]))
                    // this.props.onChange(this.state.fileList)
              };
    }

    const showModal = () => setModalVisible(true)
    const handleCancel = () => setModalVisible(false);

    const handleOk = async () => {
        setModalVisible(false);
        // var data = new FormData();

        // fileList.forEach((file) => {
        //     data.append('files[]', file);
        // });
        
        var datasBody = JSON.stringify({
            idProduct : props.match.params.id,
            userToken: props.userToken,
            title: titleComment,
            message: messageComment,
            note: noteComment,
            //images: data
        })
       await fetch(`http://${adressIp}:3000/addComment`,
        {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: datasBody
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(datas) {
            //Reponse du backend qui permet de savoir si la création du compte a réussi
            console.log(datas.result);
            setTitleComment('');
            setMessageComment('');
            setNoteComment('');
            setTest(test => test + 1)
            //setCommentsList(comment => comment.concat(datas.result.comments))
        })
        .catch(function(err) {
            console.log(err);
        })
    } 

    

    //Permet d'ajouter un produits dans le panier d'un user, en base de donnée et dans le reducer
    const addProduct = (productId) => {
        props.addProduct(productId);
        if(props.userIsConnected) {
            fetch(`http://${adressIp}:3000/addProduct`,
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `idProduct=${productId}&userToken=${props.userToken}` //Envoie l'id du produit et le token du user
            })  
        } else {
            fetch(`http://${adressIp}:3000/addProductCookie?idProduct=${productId}`,
            {
                withCredentials: true,
                credentials: 'include',
            })  
        }  
    }


    var comments;

    if(commentsList && commentsList.length < 1) {
        comments = 
        <h3> Il n'y a pas d'avis pour l'instant </h3>
    } else {
        comments = 
            commentsList.map((element, index) => (
                <Comment
                    key={index}
                    author={<h6> {element.user.first_name.substr(0, 1)}.{element.user.last_name}</h6>}
                    avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                    />
                    }
                    content={
                        <Fragment>
                            <div className='rate-comment'>
                                <Rate allowHalf disabled value={element.note}  />
                            </div>
                            <h6> {element.title} </h6>
                            
                            <p> {element.message} </p>
                        </Fragment>
                    }
                    datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                    }
                />
            ))
    }

    if(redirectModal) {
        return(
            <Redirect to='Login' />
        );
    } else {
        return (
            <Container fluid={true}>
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
                                <div style={{marginBottom: '0.5em'}}>
                                    <Rate allowHalf disabled value={3.5} />
                                </div>
                                <h5> {product.price} € </h5>
                                <div className='descProduct'>
                                    <p> {product.description} </p>
                                </div>
                                <Button type='primary' size='large' style={{width: '11em'}} onClick={() => addProduct(product._id)}> Ajouter au panier </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
    
                <SimilarProduct />
    
                <div className='containerTabs'>                
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Avis" key="1">
                            <Row>
                                <Col md={{size: 10, offset: 1}}>
                                    <Button type='primary' style={{marginBottom: '1.5em'}} onClick={() => showModal()}> Ajouter un avis </Button>
                                    {comments}
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Photos" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                    </Tabs>
                </div>
                <Footer /> 
    
                <Modal title="Ajouter un avis" visible={modalVisible}  onOk={handleOk} onCancel={handleCancel}>
                    <Comment
                        author={
                            <div className='container-input-title-comment'>
                                <Input className='input-comment' placeholder='Entrez un titre' value={titleComment} onChange={(e) => setTitleComment(e.target.value)} />
                            </div>}
                        avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                        }
                        content={
                            // Raccourcis Fragment
                            <>
                                <div className='text-area-comment'>
                                    <TextArea rows={4} value={messageComment} onChange={(e) => setMessageComment(e.target.value)} />
                                </div>
                                <div className='container-note-comment'>
                                    <Form.Item label='Note'>
                                        <div className='note-comment'>
                                            {/* Probleme Rate */}
                                            <Rate allowHalf value={noteComment} onChange={(e) => setNoteComment(e) }  />
                                        </div>
                                    </Form.Item>                                
                                </div>
                                <div>
                                    <h6> Ajouter des photos</h6>
                                    <Upload listType='picture-card' beforeUpload={beforeUpload}>
                                        <Icon type="plus" style={{fontSize: '2.5em'}} />
                                        <div className="ant-upload-text">Upload</div>
                                    </Upload>
                                </div>
                            </>  
                        }
                    />
                </Modal>
            </Container>
        );
    }    
}

function mapStateToProps(state) {
    return {
        userIsConnected : state.UserConnected,
        userToken: state.User.token,
        userPanier: state.User.panier
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProduct: function(idProduct) {
            dispatch({
                type: 'addProduct',
                idProduct: idProduct
            })
        },
        addProductNotConnected: function(idProduct) {
            dispatch({
                type: 'addProductNotConnected',
                idProduct: idProduct
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ProductPage)