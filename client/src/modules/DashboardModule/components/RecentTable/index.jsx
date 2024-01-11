import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

const chartSetting = {
  yAxis: [
    {
      label: 'Data Month  ',
    },
  ],
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};
const dataset = [
  {
    India: 59,
    NRI: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jan',
  },
  {
    India: 50,
    NRI: 52,
    newYork: 78,
    seoul: 28,
    month: 'Fev',
  },
  {
    India: 47,
    NRI: 53,
    month: 'Mar',
  },
  {
    India: 54,
    NRI: 56,
    month: 'Apr',
  },
  {
    India: 57,
    NRI: 69,
    month: 'May',
  },
  {
    India: 60,
    NRI: 63,

    month: 'June',
  },
  {
    India: 59,
    NRI: 60,
    month: 'July',
  },
  {
    India: 65,
    NRI: 60,
    newYork: 106,
    seoul: 249,
    month: 'Aug',
  },
  {
    India: 51,
    NRI: 51,
    newYork: 95,
    seoul: 131,
    month: 'Sept',
  },
  {
    India: 60,
    NRI: 65,
    newYork: 97,
    seoul: 55,
    month: 'Oct',
  },
  {
    India: 67,
    NRI: 64,
    newYork: 76,
    seoul: 48,
    month: 'Nov',
  },
  {
    India: 61,
    NRI: 70,
    newYork: 103,
    seoul: 25,
    month: 'Dec',
  },
];

const valueFormatter = (value) => `${value}mm`;

export default function BarsDataset() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'India', label: 'India', valueFormatter },
        { dataKey: 'NRI', label: 'NRI', valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}