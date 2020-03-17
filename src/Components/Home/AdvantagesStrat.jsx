import React from 'react'
import { Row, Col } from 'reactstrap';
import Slider from "react-slick";

const advantageDatas = [
    {
        text: 'Meilleurs produits de dessin',
    },
    {
        text: 'Meilleurs produits de dessin',
    },
    {
        text: 'Meilleurs produits de dessin',
    },
    {
        text: 'Meilleurs produits de dessin',
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
                                        <div className='imageAdvantage'> </div>
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