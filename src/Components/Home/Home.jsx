import React, { useState, useEffect } from 'react'
import { Container } from 'reactstrap';
import { notification } from 'antd';
import {connect} from 'react-redux';

import { adressIp } from '../../config';
import Header from '../Menu/Header';
import HomeCarousel from './HomeCarousel';
import AdvantageStrat from './AdvantagesStrat';
import SimilarProduct from '../SimilarProduct';
import ParallaxHome from './Parallax';
import PartnerCarousel from './PartnerCarousel';
import Footer from '../Menu/Footer';

function Home() {
    const [productsHome, setProductHome] = useState([])
    useEffect(() => {
        fetch(`http://${adressIp}:3000/getProductsHome`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas.result) {
                datas.result.sort((a, b) => {
                    return b.soldNumber - a.soldNumber;
                })
                let arrayProductsList = [];
                for(var i = 0; i < 4; i++) {
                    arrayProductsList.push(datas.result[i]);
                }
                setProductHome(arrayProductsList);
            }            
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    return (    
        <Container fluid={true}>
            <Header />
            <HomeCarousel />
            <AdvantageStrat />
            <SimilarProduct similarProducts={productsHome} type={1} />
            <ParallaxHome />
            <PartnerCarousel />
            <Footer />
        </Container>
    );
}

export default connect(
    null, 
    null
)(Home)