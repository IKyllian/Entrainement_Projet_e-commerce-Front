import React, { useEffect, useState } from 'react'; 
import { Container } from 'reactstrap';
import { Breadcrumb, Comment, Avatar, Rate, Modal, Input, Form, Upload, Icon, Result, Button, notification} from 'antd';
import { connect } from 'react-redux';

import { adressIp } from '../../config';
import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
import SimilarProduct from '../SimilarProduct'
import { Redirect, Link } from 'react-router-dom';

import TabsComment from './TabsComment';
import ProductDesc from './ProductDesc';
import CommentsList from './CommentsList';
import Fil_Ariane from '../Fil-ariane';

const { TextArea } = Input;

function ProductPage(props) {
    const [product, setProduct] = useState({});
    const [isLoad, setIsLoad] = useState(true);
    const [commentsList, setCommentsList] = useState([]);
    const [imagesComment, setImagesComment] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [redirectModal, setRedirectModal] = useState(false)//Sert a redirect si le user est pas connecter et qu'il veut ajouter un avis 
    const [buttonDisable, setButtonDisable] = useState(false)

    const [titleComment, setTitleComment] = useState('');
    const [messageComment, setMessageComment] = useState('');
    const [noteComment, setNoteComment] = useState();
    const [fileList, setFileList] = useState([]);

    const[statusTitleComment, setStatusTitleComment] = useState('');
    const[statusMessageComment, setStatusMessageComment] = useState('');
    const[statusNoteComment, setStatusNoteComment] = useState('');
    const[statusNote, setStatusNote] = useState('');

    const [loadComments, setLoadComments] = useState(0);
    const [productExist, setProductExist] = useState(true)

    const redirectModalComments = () => setRedirectModal(true);
    const showModal = () => setModalVisible(true)
    const handleCancel = () => setModalVisible(false);

    const openNotificationWithIcon = (type, action) => {
        notification[type]({
          message: 'Une erreur est survenue',
          description:
            `${action === 'comment' ? 'Un problème est survenue lors de l\'ajout de votre avis' : 'Votre article n\'a pas été mis au panier'}, veuillez réesayer plus tard si cela persiste`,
        });
    };
    
    useEffect(() => {
        //Permet, au chargement de la page, d'aller chercher en base de donnée le produit correspondant a l'id envoyer 
        fetch(`http://${adressIp}:3000/product?id=${props.match.params.id}`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas.result) {
                setIsLoad(false)
                datas.result.stock < 1 ? setButtonDisable(true) : setButtonDisable(false);
                setProduct(datas.result);
                setCommentsList(datas.result.comments);
                if(datas.result.comments.length >= 1) {
                    var imgArray = [];
                    for(var i = 0; i < datas.result.comments.length; i++) {
                        for(var j = 0; j < datas.result.comments[i].images.length; j++) {
                            imgArray.push({
                                src: datas.result.comments[i].images[j],
                                width: 1,
                                height: 1
                            });
                        }
                        
                    }
                }
                var similarProducts = [];
                for(var y = 0; y < datas.allProducts.length; y++) {
                    if(datas.allProducts[y].type === datas.result.type) {
                        if(datas.allProducts[y]._id !== datas.result._id) {
                            similarProducts.push(datas.allProducts[y]);
                        }
                    }
                }
                if(similarProducts.length < 4) {
                    const newArray = datas.allProducts.filter(element => element.type !== datas.result.type);
                    newArray.sort((a, b) => {
                        return a.soldNumber + b.soldNumber;
                    });
                    let numberFor = 4 - similarProducts.length;
                    for(var x = 0; x < numberFor; x++) {
                        if(newArray[x].type !== datas.result.type) {
                            similarProducts.push(newArray[x]);
                        }
                    }
                }
                setSimilarProducts(similarProducts);
                setImagesComment(imgArray);
            } else {
                setProductExist(false)
            }            
        })
        .catch(err => {
            console.log(err);
        })
    }, [loadComments, props.match.params.id])

    const beforeUpload = (file) => {
        console.log(file)
        let files = [];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {      
            file.thumbUrl = e.target.result;
            files.push(file);
            let newArrayFile = []
            newArrayFile.push(files[0].thumbUrl);

            setFileList(fileList => fileList.concat([...newArrayFile]))
        };
    }

    const deleteImage = (file) => {
        if(fileList && fileList.length > 0) {
            for(var i = 0; i < fileList.length; i++) {
                if(file.originFileObj.thumbUrl === fileList[i]) {
                    var newArray = [...fileList];
                    newArray.splice(i, 1);
                    setFileList(newArray);
                    break;
                }
            }
        }
    }
    console.log('aze',fileList)

    const handleOk = async () => {
        if(titleComment === '' || messageComment === '' || !noteComment) {
            console.log(statusTitleComment)
            titleComment === '' ? setStatusTitleComment('error') : setStatusTitleComment('success')
            messageComment === '' ? setStatusMessageComment('error') : setStatusMessageComment('success')
            !noteComment ? setStatusNoteComment('Veuillez mettre une note') : setStatusNoteComment('')
            !noteComment ? setStatusNote('error') : setStatusNote('succes');
        } else {
            var datasBody = JSON.stringify({
                idProduct : props.match.params.id,
                userToken: props.userToken,
                title: titleComment,
                message: messageComment,
                note: noteComment,
                images: fileList
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
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas.result) {
                    setTitleComment('');
                    setMessageComment('');
                    setNoteComment(null);
                    setLoadComments(loadComments => loadComments + 1)
                    setFileList([]);
                    setModalVisible(false);
                } else {
                    openNotificationWithIcon('error', 'comment');
                } 
            })
            .catch(err => {
                console.log(err);
            })
        }    
    }

    //Permet d'ajouter un produits dans le panier d'un user, en base de donnée et dans le reducer
    const addProduct = async (productId, price) => {
        if(props.userIsConnected) {
            await fetch(`http://${adressIp}:3000/addProduct`,
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `idProduct=${productId}&userToken=${props.userToken}` //Envoie l'id du produit et le token du user
            })
            .then(response => {
                return response.json();
            })
            .then(datas => {
                console.log('datas', datas);
                if(datas.saveSuccess) {
                    if(datas.productExist) {
                        props.addExistProduct(datas.indexProduct, price);
                    } else {
                        props.addProduct(productId, price);
                    }
                } else {
                    openNotificationWithIcon('error', 'addProduct');
                }
            }) 
        } else {
            await fetch(`http://${adressIp}:3000/addProductCookie?idProduct=${productId}`,
            {
                withCredentials: true,
                credentials: 'include',
            })
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    if(datas.productExist) {
                        props.addExistProduct(datas.indexProduct, price);
                    } else {
                        props.addProduct(productId, price);
                    }
                }
            })   
        }  
    }

    if(redirectModal) {
        return(
            <Redirect to='/Signup' />
        );
    } else {
        return (
            !productExist &&
            <Result
                status="404"
                title="404"
                subTitle="Désolé, la page que vous voulez visiter n'éxiste pas"
                extra={<Link to='/'> <Button type="primary">Back Home</Button> </Link>}
            /> ||
            productExist &&
            <Container fluid={true}>
                <Header />
                <Fil_Ariane previousPage='Catalogue' currentPage='Page Produit' />
                <ProductDesc product={product} addFunction={addProduct} buttonDisable={buttonDisable} isLoad={isLoad}  />
                <SimilarProduct similarProducts={similarProducts} type={2} />
                <TabsComment comments={<CommentsList commentsList={commentsList} />} imagesComment={imagesComment} redirectModal={redirectModalComments} showModal={showModal} userIsConnected={props.userIsConnected} />
                <Footer />
                {
                    props.userIsConnected &&
                    <Modal title="Ajouter un avis" visible={modalVisible}  onOk={handleOk} onCancel={handleCancel} style={{top: 30}}>
                    <Comment
                        author={
                            <div className='container-input-title-comment'>
                                <Form.Item validateStatus={statusTitleComment} hasFeedback>
                                    <Input className='input-comment' placeholder='Entrez un titre' value={titleComment} onChange={(e) => setTitleComment(e.target.value)} />
                                </Form.Item>                                
                            </div>}
                        avatar={
                            <Avatar
                            style={{backgroundColor: props.userBackground}}
                        >
                            {props.userLastName.split('')[0]}
                        </Avatar>
                        }
                        content={
                            // Raccourcis Fragment
                            <>
                                <div className='text-area-comment'>
                                    <Form.Item validateStatus={statusMessageComment}>
                                        <TextArea rows={4}  value={messageComment} onChange={(e) => setMessageComment(e.target.value)} />
                                    </Form.Item>
                                </div>
                                <div className='container-note-comment'>
                                    <Form.Item label='Note' help={statusNoteComment} validateStatus={statusNote}>
                                        <div className='note-comment'>
                                            {/* Probleme Rate */}
                                            <Rate allowHalf value={noteComment} onChange={(e) => setNoteComment(e) }  />
                                        </div>
                                    </Form.Item>                                
                                </div>
                                <div>
                                    <h6> Ajouter des photos</h6>
                                    <Upload listType='picture-card' beforeUpload={beforeUpload} onRemove={(file) => deleteImage(file)}>
                                        <Icon type="plus" style={{fontSize: '2.5em'}} />
                                        <div className="ant-upload-text">Upload</div>
                                    </Upload>
                                </div>
                            </>  
                        }
                    />
                </Modal>
                }
            </Container>
        );
    }    
}

function mapStateToProps(state) {
    return {
        userIsConnected : state.UserConnected,
        userToken: state.User.token,
        userPanier: state.User.panier,
        userLastName: state.User.lastName,
        userBackground: state.User.background_profil
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProduct: function(idProduct, price) {
            dispatch({
                type: 'addProduct',
                idProduct: idProduct,
                price : price
            })
        },
        addExistProduct: function(index, price) {
            dispatch({
                type: 'addExistProduct',
                index: index,
                price : price
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ProductPage)