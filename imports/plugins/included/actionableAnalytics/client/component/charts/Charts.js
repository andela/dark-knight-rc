/* eslint-disable */
import React from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, LineChart, Line, Cell
} from "recharts";

const Charts = ({ showSalesChart, salesData,
  displayCanceledOrder, canceledOrderData,
  pieChartData, displayPieChart, data, displaySalesChart,
  displayOrderChart, displayCancelledOrder, displayPurchaseProduct }) => {
  const colors = ["#f43535", "#00ad17"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
    	{`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="container">
      <div >
        {/* Display Bar for cancelled Order */}
        {
          displayCanceledOrder && (
            <BarChart
              width={600}
              height={400}
              data={canceledOrderData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <Tooltip />
              <Legend />
              <YAxis dataKey="quantityCancelled" />
                displayPurchaseProduct && <Bar dataKey="quantityCancelled" fill="#344454" />

            </BarChart>
          )
        }
        {/* Display pie chart */}
        {
          displayPieChart && (
            <PieChart
              width={600}
              height={400}
            >
            <Legend payload={[{ value: 'Total order', type: 'rect', id: 'ID01', color: '#4da937' }, { value: 'Total cancelled Order', type: 'rect', id: 'ID02', color: '#f43535' }]}/>
              <Pie data={pieChartData}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                cx={300}
                cy={200}
                innerRadius={80}
                fill = "#8884d8"
              >
                {
                  pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                  )
                }
              </Pie>
            </PieChart>
          )
        }
        {/* display line chart for sales history */}
        {
          showSalesChart && (<LineChart
            width={600}
            height={400}
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Legend />
            <YAxis/>

            <Line type="monotone" dataKey="sales" stroke="#82ca9d"/>

          </LineChart >)

        }

        {/* Display Bar chart */}
        { (displayPurchaseProduct || displaySalesChart || displayOrderChart || displayCancelledOrder) && (<BarChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" />
          <Tooltip />
          <Legend />
          {/* Display different label on Y-aix */}
          {displayPurchaseProduct &&  <YAxis dataKey="quantitySold"/>}
          {displaySalesChart &&  <YAxis dataKey="price" label="$"/>}
          {displayOrderChart &&  <YAxis dataKey="price" label="$"/>}
          {displayCancelledOrder &&  <YAxis dataKey="price" label="$"/>}

          {/* Display appropriate x-axis label and value */}
          {
            displayPurchaseProduct && <Bar dataKey="quantitySold" fill="#344454" />
          }

          {

            displaySalesChart && <Bar dataKey="price" fill="#344454" />
          }

          {
            displayOrderChart && <Bar dataKey="price" fill="#344654" />
          }

          {
            displayCancelledOrder && <Bar dataKey="price" fill="#344954" />
          }


        </BarChart>)
        }
      </div>
    </div>
  );
};

export default Charts;

