import React, { Fragment } from 'react'; 
import { Comment, Tooltip, Avatar, Rate } from 'antd';
import moment from 'moment';

function CommentsList({commentsList}) {
    if(commentsList && commentsList.length < 1) {
        return(
            <h3> Il n'y a pas d'avis pour l'instant </h3>
        );
    } else {
        return(
            commentsList.map((element, index) => (
                <Comment
                    key={index}
                    author={<h6> {element.user.first_name.substr(0, 1)}.{element.user.last_name}</h6>}
                    avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                    />
                    }
                    content={
                        <Fragment>
                            <div className='rate-comment'>
                                <Rate allowHalf disabled value={element.note}  />
                            </div>
                            <h6> {element.title} </h6>
                            
                            <p> {element.message} </p>
                            {
                                element.images.map((images, i) => (
                                        <div key={i} className='img-comment' style={{backgroundImage: `url(${images})`}}> </div>
                                ))
                            }
                        </Fragment>
                    }
                    datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                    }
                />
            ))
        );
    }
}

export default CommentsList