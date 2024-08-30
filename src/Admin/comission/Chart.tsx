import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DonutState {
  options: ApexOptions;
  series: any;
  labels: string[];
}

class Donut extends Component<{}, DonutState> {
  constructor(props: any) {
    super(props);

    this.state = {
      options: {} as ApexOptions,
      series: [44, 55, 41, 17, 15] as ApexNonAxisChartSeries,
      labels: ['A', 'B', 'C', 'D', 'E']
    }
  }

  render() {
    return (
      <div className="donut">
        <Chart options={this.state.options} series={this.state.series} type="donut" width="380" />
      </div>
    );
  }
}

interface ApexChartState {
    series: any;
  options: ApexOptions;
}

class ApexChart extends React.Component<{}, ApexChartState> {
  constructor(props: any) {
    super(props);

    this.state = {
      series: [{
        name: 'Servings',
        data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65]
      }],
      options: {
        annotations: {
          points: [{
            x: 'Bananas',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0',
              },
              text: 'Commission Chart Flow',
            }
          }]
        },
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: '50%',
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 0
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Servings',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          },
        }
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export { ApexChart, Donut };