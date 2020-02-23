import React, {useEffect, useState} from 'react'; 
import { Container, Row, Col } from 'reactstrap';
import { Breadcrumb, Dropdown, Menu, Pagination } from 'antd';
import {connect} from 'react-redux';
import ReactPaginate from 'react-paginate';

import {adressIp} from '../../config';
import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
import ProductList from './ProductList';
import Filter from './Filter';
import SortDropdown from './Sort-Dropdown';

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
    const [sortBy, setSortBy] = useState(['Pertinence', 'Prix les moins cher', 'Prix les plus cher', 'A-Z'])

    //Permet de récuperer les produits, du back, au chargement de la page
    useEffect(() => {
        fetch(`http://${adressIp}:3000/getProducts`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(!props.infoItems) {
                if(props.priceFilter[0] === 0 && props.priceFilter[1] === 500) {
                    setProducts(datas.products);
                    setProductsFilterPrice(datas.products);
                } else {
                    let filterDatas = datas.products.filter(elmt => elmt.price >= props.priceFilter[0] && elmt.price <= props.priceFilter[1])
                    setProducts(filterDatas);
                    setProductsFilterPrice(filterDatas);
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
        // console.log('checkedKeys', checkedKeys);
        // console.log('info', info);
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
        console.log('productsFilterPrice', productsFilterPrice)
        //Filtre les produits en fonction du prix
        let priceFilter = productsFilterPrice.filter(elmt => elmt.price >= value[0] && elmt.price <= value[1]);
        setProducts(priceFilter)
        setCurrentFilterPrice(value)
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
                <Col lg='3' className='mb-sm-3 container-top-catalogue-responsive'>
                    <h2 className='d-xs-block d-lg-none text-center'> Catalogue </h2>
                    <div className='container-sort-by d-sm-inline-block d-lg-none ml-sm-4'>
                        <SortDropdown elmtsDropdown={sortBy} />
                    </div>
                    <div className='d-inline-block float-sm-right float-lg-none filter-responsive'>
                        <Filter onCheck={onCheck} onAfterChange={onAfterChange} />
                    </div>
                </Col>
                <Col lg='9' xs='12' className='ml-sm-3 ml-lg-0 product-list-responsive' >
                    <div className='container-product'>
                        <div>
                            <div className='container-sort-by-responsive d-sm-none d-lg-inline-block'>
                                <SortDropdown elmtsDropdown={sortBy} />
                            </div>
                            <h2 className='titleCatalogue d-sm-none d-lg-inline-block'> Catalogue </h2>
                        </div>
                        
                        <div>
                            <ProductList productList={products} />
                            {/* <ReactPaginate
                                previousLabel={'previous'}
                                nextLabel={'next'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={4}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                containerClassName={'pagination'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                            /> */}
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