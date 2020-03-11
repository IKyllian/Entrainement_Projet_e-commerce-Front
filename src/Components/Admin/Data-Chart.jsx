import React, { useEffect, useState } from 'react'
import { Layout } from 'antd';
import { Bar, Line, Pie } from 'react-chartjs-2';

import Menu from './Menu';
import {adressIp} from '../../config';
import NavHeader from './Nav';
import Chart from './Chart';

const { Sider, Content } = Layout;

const createChartDatas = (labels, datas, labelDatasets, backgroundColor) => {
    return (
        {
            chartData:{
                labels: labels,
                datasets:[
                {
                    label: labelDatasets,
                    data: datas,
                    backgroundColor: backgroundColor,
                }
                
                ],
            }
        }
    );
}

function DataChart() {
    const [usersCountDatas, setUsersCountDatas] = useState({});
    const [ordersCountDatas, setOrdersCountDatas] = useState({});
    const months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
    const defaultValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    useEffect(() => {
        fetch(`http://${adressIp}:3000/admin/datasChart`)
            .then(response => {
                return response.json();
            })
            .then(datas => {
                if(datas) {
                    var datasForUsersDatasSets = [...defaultValues];
                    var datasForOrdersDatasSets = [...defaultValues];

                    for(var i = 0; i < datas.userResult.length; i++) {
                        datasForUsersDatasSets[datas.userResult[i]._id.month - 1] = datas.userResult[i].usercount;
                    }

                    for(var j = 0; j < datas.orderResult.length; j++) {
                        datasForOrdersDatasSets[datas.orderResult[j]._id.month - 1] = datas.orderResult[j].ordercount;
                    }

                    var userChartDatas = createChartDatas(months, datasForUsersDatasSets, 'Utilisateurs', 'rgba(255, 99, 132, 0.6)');
                    var orderChartDatas = createChartDatas(months, datasForOrdersDatasSets, 'Commandes', 'rgba(255, 99, 132, 0.6)');

                    setUsersCountDatas(userChartDatas);
                    setOrdersCountDatas(orderChartDatas);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    
    return(
        <Layout>
            <NavHeader />
            <Layout fluid='true' className='container-admin' >
                <Menu keySelected='5' /> 
                <Content className='container-content'>
                    <Chart chartDatas={usersCountDatas.chartData ? usersCountDatas.chartData : usersCountDatas} title={'Nombre d\'utilisateurs par mois (2020)'} />
                    <Chart chartDatas={ordersCountDatas.chartData ? ordersCountDatas.chartData : ordersCountDatas} title={'Nombre de commandes par mois (2020)'} />
                </Content>
            </Layout>
        </Layout>
    );
}

export default DataChart