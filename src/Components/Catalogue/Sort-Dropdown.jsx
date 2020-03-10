import React from 'react'; 
import { Dropdown, Menu } from 'antd';

const DropdownSort = ({array, functionDropdown}) => {
    var cpy = [...array];
    cpy.shift();
    const handleDropdownClick = ({item, key}) => {
        functionDropdown(item, key);
    }
    return (
        <Menu onClick={handleDropdownClick}>
            {
                cpy.map((element, i) => (
                    <Menu.Item key={i} >
                        <p target="_blank">
                            {element}
                        </p>
                    </Menu.Item>
                ))
            }
        </Menu>
    );
}

function SortDropdown({elmtsDropdown, listProducts, sortChange}) {
    const onDropdownClick = async (item, key) => {
        let spreadList = [...listProducts];
        if(item.props.children.props.children === '- / +') {
            spreadList.sort((a, b) => {
                return a.price - b.price;
            })           
        } else if(item.props.children.props.children === '+ / -') {
            spreadList.sort((a, b) => {
                return b.price - a.price;
            })
        } else if(item.props.children.props.children === 'A-Z') {
            spreadList.sort();
        } else if(item.props.children.props.children === 'Pertinence') {
            spreadList.sort((a, b) => {
                return b.soldNumber - a.soldNumber;
            })
        }
        //Permet d'inverser la valeur de l'ancien trie avec celui selectionné (Dans le Dropdown)
        var i = parseInt(key, 10) + 1
        elmtsDropdown[i] = elmtsDropdown[0]
        elmtsDropdown[0] = item.props.children.props.children;
        sortChange(spreadList, elmtsDropdown);

    } 
    return(
        <>
            <p className='sort-by'> Trier par : </p>
            <Dropdown className='sort-by-dropdown' trigger={['click']} overlay={<DropdownSort array={elmtsDropdown} functionDropdown={onDropdownClick} />}>
                <p> {elmtsDropdown[0]} </p>
            </Dropdown>
        </>

    );
}

export default SortDropdown