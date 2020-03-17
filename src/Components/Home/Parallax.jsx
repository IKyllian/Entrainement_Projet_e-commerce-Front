import React from 'react'
import { Row, Col } from 'reactstrap';
import { Button } from 'antd';
import { Parallax, Background } from 'react-parallax';

import ImageParallax from '../../Images/BackgroundParallax.jpg'

function ParallaxHome() {
    return (    
        <Parallax className='stratParallax' strength={300}>
            <h3 style={{color: 'white'}} className="text-center"> Rejoignez un atelier ou créez le votre </h3>
            <Row>
                <Col className="text-center" style={{marginTop:'1em'}}>
                    <Button type='primary'> En savoir plus </Button>
                </Col>
            </Row>
            <Background className="custom-bg">
                <img src={ImageParallax} alt="" />
            </Background>
        </Parallax>
    );
}

export default ParallaxHome