import React from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

class ColumnChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'basic-bar',
          toolbar: {
            show: false
          }
        },
        colors: ['#26408B'],
        dataLabels: {
          enabled: false
        },
        grid: {
            show: false,
          },
        xaxis: {
          categories: []
        }
      },
      series: [
        {
          name: 'Lixo',
          data: []
        }
      ]
    }
  }

  componentDidMount() {
    axios.get('http://13.59.94.236:8000/trashLog/')
      .then(response => {
        const data = response.data;
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const groupedData = data.reduce((acc, item) => {
          const date = new Date(item.date);
          const month = date.getMonth();
          acc[month] = (acc[month] || 0) + Number(item.weight);
          return acc;
        }, {});

        const seriesData = [];
        const categories = [];
        for (let i = 0; i < 12; i++) {
          if (groupedData.hasOwnProperty(i)) {
            seriesData.push(groupedData[i]);
            categories.push(monthNames[i]);
          }
        }

        this.setState(prevState => ({
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: categories
            }
          },
          series: prevState.series.map(s => s.name === 'Lixo' ? {...s, data: seriesData} : s)
        }));
      })
      .catch(error => {
        console.error("Erro ao buscar dados", error);
      });
  }

  render() {
    return (
      <div className="bar">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          width="500"
        />
      </div>
    );
  }
}

export default ColumnChart;
