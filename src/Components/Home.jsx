import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { Carousel } from 'antd';
import { Parallax, Background } from 'react-parallax';
import Slider from "react-slick";
import {connect} from 'react-redux';

//import {adressIp} from '../config';
import Header from './Menu/Header';
import SimilarProduct from './SimilarProduct';
import Footer from './Menu/Footer';
import { adressIp } from '../config';

import ImageParallax from '../Images/BackgroundParallax.jpg'
import partenaire1 from '../Images/partner-fb.png'


const partenairesImg = [
    {
        img: partenaire1
    },
    {
        img: partenaire1
    },
    {
        img: partenaire1
    },
    {
        img: partenaire1
    }
]

function Home(props) {
    const [productsHome, setProductHome] = useState([])
    useEffect(() => {
        fetch(`http://${adressIp}:3000/getProductsHome`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas.result) {
                datas.result.sort((a, b) => {
                    return a.soldNumber + b.soldNumber;
                })
                console.log( datas.result);
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

    const settings = {
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1
      };

    return (    
        <Container fluid={true}>
            <Header />

            {/* <div className='firstStratHome' style={{height: '470px', overflow: 'auto'}}>
                <h1 className='text-center' style={{color: 'white',width: '60%', margin: 'auto', textTransform: 'capitalize'}}> Poussez les limites de votre imagination grace a du materiel professionnel  </h1>
            </div> */}

            <div className='carouselContainer'>
                <Carousel autoplay effect='scrollx'>
                    <div className='firstStratHome'>
                        <h1 className='text-center titleCarousel'> Poussez les limites de votre imagination grace a du materiel professionnel </h1>
                    </div>
                    <div className='firstStratHome'>
                        <h1 className='text-center titleCarousel'> Poussez les limites de votre imagination grace a du materiel professionnel </h1>
                    </div>
                </Carousel>
            </div>


            <div className='advantageStratContainer'>
                <div>
                    <Row style={{ paddingTop:'3em'}}>
                        <Col>
                            <div className='itemAdvantage'>
                                <div className='imageAdvantage'> </div>
                                <p className='textAdvantage'> Meilleurs produits de dessin </p>
                            </div>
                        </Col>
                        <Col>
                            <div className='itemAdvantage'>
                                <div className='imageAdvantage'> </div>
                                <p className='textAdvantage'> Meilleurs produits de dessin </p>
                            </div>
                        </Col>
                        <Col>
                            <div className='itemAdvantage'>
                                <div className='imageAdvantage'> </div>
                                <p className='textAdvantage'> Meilleurs produits de dessin </p>
                            </div>
                        </Col>
                        <Col>
                            <div className='itemAdvantage'>
                                <div className='imageAdvantage'> </div>
                                <p className='textAdvantage'> Meilleurs produits de dessin </p>
                            </div>
                        </Col>
                    </Row>
                </div>
                
            </div>

            <SimilarProduct similarProducts={productsHome} type={1} />
            
            <Parallax className='stratParallax' strength={300}>
                <h3 style={{color: 'white'}} className="text-center"> Rejoignez un atelier ou créez le votre </h3>
                <Row>
                    <Col className="text-center" style={{marginTop:'1em'}}>
                        <Button style={{backgroundColor: '#567679'}}> En savoir plus </Button>
                    </Col>
                </Row>
                <Background className="custom-bg">
					<img src={ImageParallax} alt="" />
				</Background>
            </Parallax>

            <div className='sliderPartnerContainer'>
                <h3 className='text-center titleSliderPartner'> Les marques qui nous font confiance </h3>
                <div style={{marginLeft:'8em'}}>
                    <Slider {...settings} style={{marginTop: '3em'}}>
                        {
                            partenairesImg.map((element, i) => (
                                <div key={i}>
                                    <img src={element.img} alt='' className='imageSliderPartner' />
                                </div>
                            ))
                        }
                    </Slider>
                </div>
            </div>
        <Footer />
        </Container>
    );
}

export default connect(
    null, 
    null
)(Home)