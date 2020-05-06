import React, { useState, useEffect, Fragment } from 'react';
import { Collapse, Divider } from 'antd';
import { Row, Col} from 'reactstrap';

import { adressIp } from '../../config';

const { Panel } = Collapse;

function UserCodeComponent({userToken, userDiscountCodes}) {
    const [discountCodes, setDiscountCodes] = useState([]);

    useEffect(() => {
        fetch(`http://${adressIp}:3000/getUserDicountCodes?userToken=${userToken}`)
        .then(response => {
            return response.json();
        })
        .then(datas => {
            if(datas && datas.response) {
                setDiscountCodes(datas.response);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [userDiscountCodes])
    return(
        <Row>
            <Col xs='10' className='mt-3'>
                <Collapse className='collapse-promo-code'>
                    {
                        discountCodes && discountCodes.length >= 1 &&
                        <Panel header="Vos codes promos" key='1'>
                            {
                                discountCodes && discountCodes.length >= 1 &&
                                discountCodes.map((element, index) => (
                                    <Fragment key={index}>
                                        <div className='promo-code-element'>
                                            <p className='p-promo-code'> {element.code} </p>
                                            <p className='p-promo-code'> {element.discount_price} € </p>
                                        </div>
                                        {
                                            index !== discountCodes.length - 1 &&
                                            <Divider className='divider-promo-code' />
                                        }
                                    </Fragment>
                                ))
                            }
                        </Panel>
                    }
                    {
                        discountCodes && discountCodes.length < 1 &&
                        <Panel header="Vos codes promos" key='1' disabled></Panel>
                    }
                    
                </Collapse>
            </Col>
        </Row>
        
    );
}

export default UserCodeComponent