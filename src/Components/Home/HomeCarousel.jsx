import React from 'react'
import { Carousel } from 'antd';

function HomeCarousel() {
    return (    
        <div className='carouselContainer'>
            <Carousel autoplay effect='scrollx'>
                <div className='firstStratHome'>
                    <h1 className='text-center titleCarousel'> Poussez les limites de votre imagination grâce a du materiel professionnel </h1>
                </div>
                <div className='secondStratHome'>
                    {/* <h1 className='text-center titleCarousel'> Poussez les limites de votre imagination grâce a du materiel professionnel </h1> */}
                </div>
            </Carousel>
        </div>
    );
}

export default HomeCarousel