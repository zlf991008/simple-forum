import * as React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

// @mui
import { Card, CardHeader, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

import axios from 'axios';
import { fDateSlash } from '../../../utils/formatTime';
// components
import { BaseOptionChart } from '../../../components/chart';

// hooks
import useCurrentUser from '../../../hooks/useCurrentUser';

// ----------------------------------------------------------------------

ActivityChart.propTypes = {};

export default function ActivityChart() {
  const [chartData, setChartData] = React.useState([]);
  const [heatData, setHeatData] = React.useState([]);
  const [averageHeatData, setAverageHeatData] = React.useState([]);
  const { currentUser } = useCurrentUser();
  React.useEffect(() => {
    const fetchHeatData = async () => {
      await axios
        .get('/activity/getData', {
          params: {
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            setHeatData(res.data.data.userHeatData);
            setAverageHeatData(res.data.data.averageHeatData);
          }
        });
    };

    fetchHeatData();
  }, [currentUser.userId]);

  React.useEffect(() => {
    if (heatData) {
      setChartData([
        {
          // name: '@Yours',
          name: '我',
          type: 'line',
          fill: 'solid',
          data: heatData,
        },
        {
          // name: 'Average',
          name: '平均',
          type: 'area',
          fill: 'gradient',
          data: averageHeatData,
        },
        // {
        //   name: 'Activity Heat',
        //   type: 'column',
        //   fill: 'solid',
        //   data: heatData,
        // },
      ]);
    }
  }, [heatData, averageHeatData]);

  const chartLabels = [
    '01/01/2022',
    '02/01/2022',
    '03/01/2022',
    '04/01/2022',
    '05/01/2022',
    '06/01/2022',
    '07/01/2022',
    '08/01/2022',
    '09/01/2022',
    '10/01/2022',
    '11/01/2022',
    '12/01/2022',
  ];

  // const chartData = [
  // {
  //   name: 'Team A',
  //   type: 'column',
  //   fill: 'solid',
  //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
  // },
  // {
  //   name: 'Team B',
  //   type: 'area',
  //   fill: 'gradient',
  //   data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
  // },
  //   {
  //     name: 'Team C',
  //     type: 'line',
  //     fill: 'solid',
  //     data: [0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0],
  //   },
  // ];

  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} °C`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card>
      {/* <CardHeader title="Activity" subheader="Activity in a year" /> */}
      <CardHeader title="活跃度" subheader="每月的活跃度" />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
