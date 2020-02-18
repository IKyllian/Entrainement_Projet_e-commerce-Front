import React, {useEffect, useState} from 'react'; 
import { Container, Row, Col, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Pagination, Slider, Breadcrumb, Tree, Rate } from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {adressIp} from '../config';
import Header from './Menu/Header';
import Footer from './Menu/Footer';

const { TreeNode } = Tree;

const checkArray = (arrayFilter, arrayToCheck) => {
    let arrayCheck = [];
    for(let i = 0; i < arrayToCheck.length; i++) {
        let check = arrayFilter.filter(elmt => elmt.type === arrayToCheck[i].props.title.toLowerCase());
        arrayCheck = arrayCheck.concat(check);
    }
    return arrayCheck;
}

function Catalogue(props) {
    const [products, setProducts] = useState([]);
    const [productsCpy, setProductsCpy] = useState([]);
    const [productsFilterPrice, setProductsFilterPrice] = useState([]);
    const [currentFilterPrice, setCurrentFilterPrice] = useState([0, 500]);

    //Permet de récuperer les produits, du back, au chargement de la page
    useEffect(() => {
        fetch(`http://${adressIp}:3000/getProducts`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(!props.infoItems) {
                if(props.priceFilter[0] === 0 && props.priceFilter[1] === 500) {
                    console.log('1')
                    setProducts(datas.products);
                } else {
                    console.log('2')
                    let filterDatas = datas.products.filter(elmt => elmt.price >= props.priceFilter[0] && elmt.price <= props.priceFilter[1])
                    setProducts(filterDatas);
                }
            } else {
                let arrayProducts = [];
                let arrayCheck = checkArray(datas.products, props.infoItems)
                for(var i = 0; i < props.infoItems.length; i++) {
                    let filterDatas = datas.products.filter(elmt => elmt.type === props.infoItems[i].props.title.toLowerCase() && elmt.price >= props.priceFilter[0] && elmt.price <= props.priceFilter[1])
                    arrayProducts = arrayProducts.concat(filterDatas)
                }
                setProducts(arrayProducts);      
                setProductsFilterPrice(arrayCheck);
            }
            setProductsCpy(datas.products);
           
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    const onCheck = (checkedKeys, info) => {
        console.log('checkedKeys', checkedKeys);
        console.log('info', info);
        props.addTypeFilter(checkedKeys, info.checkedNodes);

        //Permet de récuperer tous les produits qui correspondent au tableau checkedKeys(tableau des filtres sélectionnés)
        var arrayCheck = checkArray(productsCpy, info.checkedNodes)
        //Permet de savoir si l'utilisateur check ou uncheck
        if(!info.checked) {
            if(checkedKeys.length < 1) { //Vide le tableau si aucune case n'est cochée
                setProducts([]);
                setProductsFilterPrice([])
            } else { //Permet de supprimer les produits au uncheck d'un filtre
                //Filtre les produits grace au type et renvoie un nouveau tableau filté
                let removeType = products.filter(elmt => elmt.type !== info.node.props.title.toLowerCase());
                setProducts(removeType);
            }
        } else {
            //Permet de savoir si tous les filtres sont cochés ou non
            if(info.node.props.children && checkedKeys.length - 1 === info.node.props.children.length) {
                //Affiche tous les produits (Et prend en compte le filtre du prix) si toutes les case sont cochées
                let selectAll = productsCpy.filter(elmt => elmt.price >= currentFilterPrice[0] && elmt.price <= currentFilterPrice[1]);
                setProducts(selectAll);
            } else {
                //Filtre les produits grace au type et fusionne le tableau filtré et l'ancien
                let filter = arrayCheck.filter(elmt => elmt.type === info.node.props.title.toLowerCase() && elmt.price >= currentFilterPrice[0] && elmt.price <= currentFilterPrice[1]);
                setProducts(products => products.concat(filter));
            }
        }
        setProductsFilterPrice(arrayCheck)
    }

    const onAfterChange = value => {
        props.addPriceFilter(value)
        //Filtre les produits en fonction du prix
        let priceFilter = productsFilterPrice.filter(elmt => elmt.price >= value[0] && elmt.price <= value[1]);
        setProducts(priceFilter)
        setCurrentFilterPrice(value)
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
                            defaultExpandedKeys={['0-0-0']}
                            defaultCheckedKeys={props.typeFilter}
                            onCheck={onCheck}
                            selectable={false}
                        >
                            <TreeNode title="Type de Produits" key="0-0" checkable={false}>
                                <TreeNode title="Crayons de couleur" key="0-0-0" />
                                <TreeNode title="Feutre" key="0-0-1" />
                                <TreeNode title="Crayons à papier" key="0-0-2" />
                                <TreeNode title="Pinceaux" key="0-0-3" />
                                <TreeNode title="Papier" key="0-0-4" />
                                <TreeNode title="Marqueur" key="0-0-5" />
                            </TreeNode>
                        </Tree>
                        <div className='price-filter'>
                            <h6> Prix </h6>
                            <Slider range defaultValue={props.priceFilter} max={500} marks={marks} onAfterChange={onAfterChange} />
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
                            <Pagination className='text-center' defaultCurrent={1} defaultPageSize={3} />
                        </div>
                    </div>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}

function mapStateToProps(state) {
    return {
        typeFilter: state.Filter.filterTypes,
        priceFilter: state.Filter.filterPrice,
        infoItems: state.Filter.infoItems
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addTypeFilter: function(arrayItems, infoItems) {
            dispatch({
                type: 'addTypeFilter',
                arrayItems: arrayItems,
                infoItems: infoItems
            })
        },
        addPriceFilter: function(arrayPrice) {
            dispatch({
                type: 'addPriceFilter',
                arrayPrice: arrayPrice
            })
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Catalogue)