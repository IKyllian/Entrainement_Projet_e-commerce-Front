import React from 'react'
import { Row, Col } from 'reactstrap';
import Slider from "react-slick";
import partenaire1 from '../../Images/partner-fb.png'
import partenaire2 from '../../Images/partener-w-n.jpg';
import partenaire3 from '../../Images/partenaire-canson.png';
import partenaire4 from '../../Images/partner-liquitex.jpg';


const partenairesImg = [
    {
        img: partenaire1
    },
    {
        img: partenaire2
    },
    {
        img: partenaire3
    },
    {
        img: partenaire4
    }
]

function HomeCarousel() {
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
        <div className='sliderPartnerContainer'>
            <h3 className='text-center titleSliderPartner'> Les marques qui nous font confiance </h3>
            <Row>
                <Col xs={{size: 9, offset: 2}} className='mt-2'>
                    <Slider {...settings}>
                        {
                            partenairesImg.map((element, i) => (
                                <div key={i}>
                                    <img src={element.img} alt='Image partenaire' className='imageSliderPartner' />
                                </div>
                            ))
                        }
                    </Slider>
                </Col>        
            </Row>
        </div>
    );
}


export default HomeCarousel