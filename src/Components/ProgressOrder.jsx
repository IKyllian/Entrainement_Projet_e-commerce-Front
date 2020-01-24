import React from 'react';
import { Steps } from 'antd';


const { Step } = Steps;

function ProgressOrder() {
    const styleProgress = {
        marginBottom: '3em',
    }
    return(
        <div style={styleProgress}>
            <Steps current={1}>
                <Step title="Valider panier" />
                <Step title="Adresse livraison" />
                <Step title="Paiment" />
            </Steps>
        </div>
    );
}

export default ProgressOrder;