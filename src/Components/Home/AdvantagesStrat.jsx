import React from 'react'
import { Row, Col } from 'reactstrap';
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faShippingFast, faTags, faPencilRuler } from '@fortawesome/free-solid-svg-icons'

const advantageDatas = [
    {
        text: 'Meilleurs produits d\'art',
        icon : faStore
    },
    {
        text: 'Livraison rapide garantie',
        icon : faShippingFast
    },
    {
        text: 'Profitez de points a chaque achat pour bénéficié de réduction',
        icon : faTags
    },
    {
        text: 'Créez ou inscrivez-vous à des ateliers d\'art',
        icon : faPencilRuler
    },
]
function AdvantagesStrat() {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    return ( 
        <div className='advantageStratContainer'>
            <div>
                <Row style={{ paddingTop:'3em'}}>
                    <Col>
                        <Slider {...settings}>
                            {
                                advantageDatas.map((element, i) => (
                                    <div className='itemAdvantage' key={i}>
                                        <FontAwesomeIcon icon={element.icon} size='2x' />
                                        <p className='textAdvantage'> {element.text} </p>
                                    </div>
                                ))
                            }
                        </Slider>
                    </Col>
                </Row>
            </div>
        </div>
    );
}


export default AdvantagesStrat