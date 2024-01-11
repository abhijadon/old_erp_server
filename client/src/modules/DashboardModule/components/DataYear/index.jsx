import { BarPlot, ChartContainer, ChartsXAxis, ChartsYAxis } from '@mui/x-charts';
import { useEffect, useState } from 'react';

export default function Combining() {
    const [paymentData, setPaymentData] = useState([]);

    useEffect(() => {
        // Fetch data from the API endpoint
        fetch('http://localhost:5000/api/payment/list')
            .then(response => response.json())
            .then(data => {
                setPaymentData(data.result);
            })
            .catch(error => console.error('Error fetching payment data:', error));
    }, []);

    // If data is not yet available, return a loading indicator or null
    if (paymentData.length === 0) {
        return null; // You can also return a loading indicator here
    }

    // Group data by year and count payments
    const groupedData = paymentData.reduce((acc, payment) => {
        const year = payment.year;
        acc[year] = acc[year] ? acc[year] + 1 : 1;
        return acc;
    }, {});

    // Get a sorted array of years
    const years = Object.keys(groupedData).sort();

    // Convert grouped data to series format for the bar chart
    const series = years.map(year => ({
        type: 'bar',
        yAxisKey: 'paymentCount',
        data: [groupedData[year]],
        name: year,
    }));

    return (
        <ChartContainer
            series={series}
            width={500}
            height={400}
            xAxis={[
                {
                    id: 'years',
                    data: years,
                    scaleType: 'band',
                    valueFormatter: (value) => value.toString(),
                },
            ]}
            yAxis={[
                {
                    id: 'paymentCount',
                    scaleType: 'linear',
                },
            ]}
        >
            {/* Display text elements above bars */}
            {years.map(year => (
                <text
                    key={year}
                    x={(years.indexOf(year) + 0.5) * (500 / years.length)}
                    y={-10}
                    textAnchor="middle"
                >
                    {groupedData[year]}
                </text>
            ))}

            <BarPlot tooltip={({ datum }) => `${datum.name}: ${datum.data[0]}`} />
            <ChartsXAxis label="Years" position="bottom" axisId="years" />
            <ChartsYAxis label="Payments Count" position="left" axisId="paymentCount" />
        </ChartContainer>
    );
}
