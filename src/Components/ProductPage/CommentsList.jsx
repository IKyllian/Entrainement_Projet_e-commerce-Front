import React, { useState } from 'react'; 
import { Carousel } from 'react-bootstrap';
import { Comment, Tooltip, Avatar, Rate, Icon, Empty, Modal, Button, Divider } from 'antd';
import moment from 'moment';

function CommentsList({commentsList}) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [indexImg, setImgIndex] = useState(0);
    const [maxSize, setMaxSize] = useState(5);

    const onShow = (i) => {
        setImgIndex(i);
        setPreviewVisible(true);
    } 
    const onCancel = () => setPreviewVisible(false);

    const loadMore = () => {
        if(commentsList.slice(0, maxSize).length >= commentsList.length) {
            console.log('azeazeaze')
        } else {
            setMaxSize(state => state + 5);
        }
    }

    if(commentsList && commentsList.length < 1) {
        return(
            <Empty description={'Il n\'y a pas de commentaire pour l\'instant'} />
        );
    } else {
        return(
            <>
                {commentsList.slice(0, maxSize).map((element, index) => ( 
                    <Comment
                        key={index}
                        author={<h6> {element.user.first_name.substr(0, 1)}.{element.user.last_name}</h6>}
                        avatar={
                        <Avatar
                            style={{backgroundColor: element.user.background_profil}}
                        >
                            {element.user.last_name.split('')[0]}
                        </Avatar>
                        }
                        content={
                            <>
                                <div className='rate-comment'>
                                    <Rate allowHalf disabled value={element.note}  />
                                </div>
                                <h6> {element.title} </h6>
                                
                                <p> {element.message} </p>
                                {
                                    element.images && element.images.length >= 1 &&
                                        element.images.map((images, i) => (
                                            <div key={i} className='img-comment' style={{backgroundImage: `url(${images})`}}>
                                                <div className='zoom-img'>
                                                    <Icon className='text-center' onClick={() => onShow(i)} style={{fontSize: '35px', margin: '0.9em'}} type="zoom-in" />
                                                </div>
                                            </div>
                                        ))
                                }
                                <Modal centered visible={previewVisible} footer={null} onCancel={onCancel}>
                                    {
                                        element.images && element.images.length < 2 &&
                                            <img alt="" style={{ width: '100%', padding: '1em 1em 0 0' }} src={element.images[indexImg]} />
                                    }
                                    {  
                                        element.images && element.images.length > 1 &&
                                            <Carousel interval={100000}>
                                                {
                                                    element.images.map((images, i) => (
                                                        <Carousel.Item key={i}>
                                                            <img alt="example" style={{ width: '100%', padding: '1em 1em 0 0' }} src={element.images[i]} />
                                                        </Carousel.Item>
                                                    ))
                                                }
                                            </Carousel>
                                    }
                                </Modal>
                            </>
                        }
                        datetime={
                            <Tooltip title={`${new Date(element.date).getFullYear()}-${new Date(element.date).getMonth()+1}-${new Date(element.date).getDate()} ${new Date(element.date).getHours()}:${new Date(element.date).getMinutes()+1}:${new Date(element.date).getSeconds()}`}>
                                <span>{moment(`${new Date(element.date).getFullYear()}/${new Date(element.date).getMonth()+1}/${new Date(element.date).getDate()} ${new Date(element.date).getHours()}:${new Date(element.date).getMinutes()+1}:${new Date(element.date).getSeconds()}`, "YYYYMMDD HH:mm:ss").startOf('minute').fromNow()}</span>
                            </Tooltip>
                        }
                    />
                ))}
                <Divider className='divider-comments' />
                {
                    commentsList.slice(0, maxSize).length !== commentsList.length &&
                    <Button type='link' className='button-load-more' onClick={() => loadMore()}> Afficher plus de commantaires </Button>
                }
            </>
        );
    }
}

export default CommentsList