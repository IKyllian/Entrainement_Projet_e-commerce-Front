import React from 'react'
import { Line } from 'react-chartjs-2';

function Chart(props) {
    return(
        <div className='chart'>
            <Line
                data={props.chartDatas}
                options={{
                    title:{
                        display: true,
                        text: props.title,
                        fontSize: 25
                    },
                    legend:{
                        display: true,
                        position: 'right'
                    },
                    scales: {
                        yAxes: [{
                          ticks: {
                            beginAtZero: true,
                            autoSkip: true,
                            maxTicksLimit: 5,
                          }
                        }]
                      }   
                }}
            />
        </div>
    );
}

export default Chart