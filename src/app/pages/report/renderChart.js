import Highcharts from 'highcharts';

const Chart = {
  chart: {
    type: 'column',
    backgroundColor: '#2a3f50',
  },

  title: {
    text: '',
  },

  xAxis: {
    categories: [],
    labels: {
      style: {
        color: '#fff',
        'font-size': '11px',
        'font-family': 'PTSans',
        'font-weight': 'bold',
      },
    },
  },

  yAxis: {
    allowDecimals: false,
    min: 0,
    title: {
      text: '',
    },
    labels: {
      style: {
        color: '#fff',
        'font-size': '11px',
        'font-family': 'PTSans',
        'font-weight': 'regular',
      },
    },
    gridLineColor: '#345168',
    lineWidth: 1,
    lineColor: '#fff',
    gridLIneWidth: 1,
  },

  exporting: {
    enabled: false,
  },

  plotOptions: {
    column: {
      stacking: 'normal',
    },
  },

  credits: {
    enabled: false,
  },

  legend: {
    itemStyle: {
      color: '#8da5b8',
    },
    itemHoverStyle: {
      color: '#fff',
    },
    itemDistance: 16,
    symbolHeight: 8,
    symbolWidth: 8,
    symbolRadius: 0,
    itemMarginTop: 15,
  },

  tooltip: {
    headerFormat: '<b>{series.name}</b><br/>',
    borderWidth: 0,
    borderRadius: 5,
    style: {
      background: '#cfdfeb',
      'font-size': '12px',
      'font-family': 'Roboto-Bold',
      color: '#3c5162',
    },
  },
};

/**
 * This is the ChartRendering function  
 * 
 * @param {Object} root in which place of DOM need to append chart 
 * @param {Object[]} data Array of objects [{date: 11.03.2020, urgent: 0, high: 1 ...}, {}, ...]
 * @param {string} sort neccessary string for chart's tooltip
 * @param {string} filter neccesary string for chart categories
 */
export function RenderChart(root, data, sort, filter) {
  const chart = Chart;

  chart.series = [
    {
      name: 'Urgent',
      data: [],
      color: '#f15a4a',
      borderWidth: 0,
    },
    {
      name: 'High',
      data: [],
      color: '#fea741',
      borderWidth: 0,
    },
    {
      name: 'Middle',
      data: [],
      color: '#fddc43',
      borderWidth: 0,
    },
    {
      name: 'Low',
      data: [],
      color: '#1abb9b',
      borderWidth: 0,
    },
    {
      name: 'Failed',
      data: [],
      color: '#8da5b8',
      borderWidth: 0,
    },
  ];

  if (filter === 'day') {
    if (data.length === 0) {
      data.push({
        urgent: 0, high: 0, middle: 0, low: 0, failed: 0,
      });
    }

    chart.xAxis.categories = ['URGENT', 'HIGH', 'MIDDLE', 'LOW', 'FAILED'];

    chart.series[0].data = [data[0].urgent, 0, 0, 0, 0];
    chart.series[1].data = [0, data[0].high, 0, 0, 0];
    chart.series[2].data = [0, 0, data[0].middle, 0, 0];
    chart.series[3].data = [0, 0, 0, data[0].low, 0];
    chart.series[4].data = [0, 0, 0, 0, data[0].failed];
  } else {
    let masDate = [];
    let masUrgent = [];
    let masHigh = [];
    let masMiddle = [];
    let masLow = [];
    let masFailed = [];
    let masData = [];
    let dateCounts;

    if (filter === 'week') {
      dateCounts = 7;
      chart.series[4].stack = 'Failed';
    } else {
      dateCounts = 30;
    }

    for (let i = 0; i < dateCounts; i++) {
      if (filter === 'week') {
        masDate.push(
          new Date(Date.now() - i * (1000 * 3600 * 24))
            .toString()
            .split(' ')[0]
            .toUpperCase(),
        );
      } else {
        masDate.push(
          new Date(Date.now() - i * (1000 * 3600 * 24))
            .toLocaleDateString('en-GB')
            .split('/')
            .slice(0, 2)
            .join('.'),
        );
      }
    }

    masDate = masDate.reverse();

    if (data.length === 0) {
      masUrgent = [...Array(dateCounts)].fill(0);
      masHigh = [...Array(dateCounts)].fill(0);
      masMiddle = [...Array(dateCounts)].fill(0);
      masLow = [...Array(dateCounts)].fill(0);
      masFailed = [...Array(dateCounts)].fill(0);
    } else {
      for (let i = 0; i < dateCounts; i++) {
        masData.push({
          date: new Date(
            Date.now() - i * (1000 * 3600 * 24),
          ).toLocaleDateString('en-US'),
          urgent: 0,
          high: 0,
          middle: 0,
          low: 0,
          failed: 0,
        });
      }

      for (let i = 0; i < dateCounts; i++) {
        if (data[i]) {
          masData.find((item) => item.date === data[i].date).urgent = data[i].urgent;
          masData.find((item) => item.date === data[i].date).high = data[i].high;
          masData.find((item) => item.date === data[i].date).middle = data[i].middle;
          masData.find((item) => item.date === data[i].date).low = data[i].low;
          masData.find((item) => item.date === data[i].date).failed = data[i].failed;
        }
      }

      masData = masData.reverse();

      masData.forEach((item) => {
        masUrgent.push(item.urgent);
        masHigh.push(item.high);
        masMiddle.push(item.middle);
        masLow.push(item.low);
        masFailed.push(item.failed);
      });
    }

    chart.xAxis.categories = masDate;
    chart.series[0].data = masUrgent;
    chart.series[1].data = masHigh;
    chart.series[2].data = masMiddle;
    chart.series[3].data = masLow;
    chart.series[4].data = masFailed;
  }

  sort = sort.replace(sort[0], sort[0].toUpperCase());
  chart.tooltip.pointFormat = `${sort}: {point.y}`;

  Highcharts.chart(root, chart);
}
