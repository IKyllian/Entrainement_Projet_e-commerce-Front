import React from 'react'; 
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

function Fil_Ariane(props) {
    return (
        <div style={{marginLeft: '2em', marginTop: '0.5em'}}>   
            <Breadcrumb>
                <Link to={props.previousPage === 'Home' ? '/' : '/Catalogue'}>
                    <Breadcrumb.Item>{props.previousPage}</Breadcrumb.Item>
                </Link>
                <Breadcrumb.Item> {props.currentPage} </Breadcrumb.Item>
            </Breadcrumb>
        </div>
    );
}

export default Fil_Ariane