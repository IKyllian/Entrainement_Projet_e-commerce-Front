import React, {useEffect, useState, Fragment} from 'react'; 
import { Container, Row, Col } from 'reactstrap';
import { Breadcrumb, Dropdown, Menu, Pagination } from 'antd';
import {connect} from 'react-redux';
import ReactPaginate from 'react-paginate';

import {adressIp} from '../../config';
import Header from '../Menu/Header';
import Footer from '../Menu/Footer';
import ProductList from './ProductList';
import Filter from './Filter';

const DropdownSort = ({array}) => {
    var cpy = [...array];
    cpy.shift();
    const onDropdownClick = ({key}) => {
        console.log(key);
    }
    return (
        <Menu>
            {
                cpy.map((element, i) => (
                    <Menu.Item key={i} onClick={onDropdownClick}>
                        <a target="_blank">
                            {element}
                        </a>
                    </Menu.Item>
                ))
            }
        </Menu>
    );
}

function SortDropdown({elmtsDropdown}) {
    return(
        <Fragment>
            <p className='sort-by'> Trier par : </p>
            <Dropdown className='sort-by-dropdown' trigger={['click']} overlay={<DropdownSort array={elmtsDropdown} />}>
                <p> {elmtsDropdown[0]} </p>
            </Dropdown>
        </Fragment>

    );
}

export default SortDropdown