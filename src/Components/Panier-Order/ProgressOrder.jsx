import React from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

function ProgressOrder(props) {
    return(
        <div className='progressBar-order'>
            <Steps current={props.index}>
                <Step title="Valider panier" />
                <Step title="Adresse livraison" />
                <Step title="Paiment" />
            </Steps>
        </div>
    );
}

export default ProgressOrder;