import React from 'react'; 
import { Skeleton} from 'antd';

function SkeletonDesc({isLoad}) {
    return (
        <Skeleton loading={isLoad} paragraph={{ rows: 7 }} active />
    );
}

export default SkeletonDesc