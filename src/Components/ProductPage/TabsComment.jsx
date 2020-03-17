import React from 'react'; 
import { Row, Col } from 'reactstrap';
import { Tabs, Button, Empty } from 'antd';
import Gallery from 'react-photo-gallery';

const { TabPane } = Tabs;

function TabsComment(props) {
    const columns = (containerWidth) => {
        let columns = 3;
        if (containerWidth < 400) columns = 2;
        return columns;
    }
    return (
        <>
            <div className='containerTabs'>                
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Avis" key="1">
                        <Row>
                            <Col xs={{size: 10, offset: 1}}>
                                <Button type='primary' style={{marginBottom: '1.5em'}} onClick={() => props.userIsConnected ? props.showModal() : props.redirectModal()}> Ajouter un avis </Button>
                                {props.comments}
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Photos" key="2">
                        <Row>
                            <Col xs={{size: 7, offset: 3}}>
                                {
                                    props.imagesComment && props.imagesComment.length >= 1 &&
                                    <Gallery photos={props.imagesComment} direction={'column'} columns={columns}  />
                                }
                                {
                                     props.imagesComment && props.imagesComment.length < 1 &&
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Il n\'y a pas de photos pour l\'instant '} />
                                }
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
}

export default TabsComment;