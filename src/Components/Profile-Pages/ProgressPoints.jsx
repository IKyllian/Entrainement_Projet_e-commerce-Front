import React from 'react';
import { Col } from 'reactstrap';
import { Steps, Statistic, Icon } from 'antd';

const { Step } = Steps;

const StepsProgress = (userSoldPoints, _getCode) => {
    const handleClick = () => {
        _getCode();
    }

    if(userSoldPoints && userSoldPoints < 200) {
        return(
            <Step status='wait' title="200 points" description="10 € de réduction" />
        );
    } else if(userSoldPoints && userSoldPoints >= 200) {
        return (
            <Step status='finish' title="200 points" description={<> <p className='user-p-desc-step'> 10 € de réduction </p> <p onClick={handleClick} className='user-p-desc-step-link'> Obtenir un code </p> </>} />
        );
    }
}

function ProgressPoints({userSoldPoints, _getCode}) {
    return (
        <>
            <Col>
                <Steps progressDot direction='vertical' >
                    { StepsProgress(userSoldPoints, _getCode) }
                </Steps>
            </Col>
            <Col xs='3'>
                <Statistic className='progress-point' title="Vos points actuels" value={userSoldPoints} suffix={<Icon style={{fontSize: '20px'}} type="gift" />} />
            </Col>
        </>
    );
}

export default ProgressPoints