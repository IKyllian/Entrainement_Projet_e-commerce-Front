import React, { Fragment, useState } from 'react'; 
import {connect} from 'react-redux';
import { Slider, Tree, Button, Drawer, Icon } from 'antd';

const { TreeNode } = Tree;

function Filter(props) {
    const [drawerResponsive, setDrawerResponsive] = useState(false);

    const handleCheck = (checkedKeys, info) => {
        props.onCheck(checkedKeys, info)
    }

    const handleChange = (value) => {
        props.onAfterChange(value)
    }

    const marks = {
        0: '5€',
        500: '500€'
    }
    return(
        <Fragment>
            <div style={{marginTop: '1em', marginLeft: '2em'}} className='d-sm-none d-lg-block filter-container'>
                <h4> Filtrer par </h4>
                <Tree
                    checkable
                    defaultExpandedKeys={['0-0-0']}
                    defaultCheckedKeys={props.typeFilter}
                    onCheck={handleCheck}
                    selectable={false}
                >
                    <TreeNode title="Type de Produits" key="0-0" checkable={false}>
                        <TreeNode title="Crayons de couleur" key="0-0-0" />
                        <TreeNode title="Feutre" key="0-0-1" />
                        <TreeNode title="Crayons à papier" key="0-0-2" />
                        <TreeNode title="Peinture" key="0-0-3" />
                        <TreeNode title="Papier" key="0-0-4" />
                        <TreeNode title="Marqueur" key="0-0-5" />
                    </TreeNode>
                </Tree>
                <div className='price-filter'>
                    <h6> Prix </h6>
                    <Slider range defaultValue={props.priceFilter} max={500} marks={marks} onAfterChange={handleChange} />
                </div>
            </div>

            <div>
                <Button className='d-sm-block d-lg-none float-right' onClick={() => setDrawerResponsive(true)}><Icon type="unordered-list" /> Filtrer </Button>
                <Drawer visible={drawerResponsive}  onClose={() => setDrawerResponsive(false)}>
                    <div style={{marginTop: '2em'}}>
                        <h4> Filtrer par </h4>
                        <Tree
                            checkable
                            defaultExpandedKeys={['0-0-0']}
                            defaultCheckedKeys={props.typeFilter}
                            onCheck={handleCheck}
                            selectable={false}
                        >
                            <TreeNode title="Type de Produits" key="0-0" checkable={false}>
                                <TreeNode title="Crayons de couleur" key="0-0-0" />
                                <TreeNode title="Feutre" key="0-0-1" />
                                <TreeNode title="Crayons à papier" key="0-0-2" />
                                <TreeNode title="Pinceaux" key="0-0-3" />
                                <TreeNode title="Papier" key="0-0-4" />
                                <TreeNode title="Marqueur" key="0-0-5" />
                            </TreeNode>
                        </Tree>
                        <div className='price-filter'>
                            <h6> Prix </h6>
                            <Slider range defaultValue={props.priceFilter} max={500} marks={marks} onAfterChange={handleChange} />
                        </div>
                    </div>

                </Drawer>
            </div>
        </Fragment>
    );
}

function mapStateToProps(state) {
    return {
        typeFilter: state.Filter.filterTypes,
        priceFilter: state.Filter.filterPrice,
        infoItems: state.Filter.infoItems
    }
}

export default connect(
    mapStateToProps, 
    null
)(Filter)