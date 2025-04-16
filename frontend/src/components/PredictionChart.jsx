import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define time templates for each building type
const buildingTimeTemplates = {
  charlesLibrary: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  techCenter: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  serc: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  default: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
};

// Temple brand colors
const TEMPLE_COLORS = {
  noise: "#9E1B34", // temple-cherry (primary)
  crowd: "#58595B"  // temple-gray-dark (neutral)
};

const PredictionChart = ({ data, buildingType = 'default' }) => {
  // Check if data is empty or contains only zero values
  const hasRealData = data && data.length > 0 && 
    data.some(item => (parseFloat(item.noise) > 0 || parseFloat(item.crowd) > 0));
  
  // Add console logging for debugging
  console.log("Prediction data:", data);
  console.log("Has real data:", hasRealData);
  
  if (!hasRealData) {
    return <p className="text-sm text-gray-400 mt-2">No prediction data yet.</p>;
  }

  // Get the appropriate time template for this building, can expand upon
  const timeTemplate = buildingTimeTemplates[buildingType] || buildingTimeTemplates.default;
  
  const chartData = timeTemplate.map(time => {
    // Find matching data point from the API data
    const matchingPoint = data.find(item => item.time === time);
    
    return {
      time,
      noise: matchingPoint ? matchingPoint.noise : 0,
      crowd: matchingPoint ? matchingPoint.crowd : 0
    };
  });

  return (
    <div className="mt-4" data-testid="prediction-chart">
      <h3 className="text-md font-semibold mb-2">Predicted Noise & Crowd Levels</h3>
      <ResponsiveContainer width="100%" height={220}> 
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
          <XAxis 
            dataKey="time"
            angle={-45}
            textAnchor="end"
            interval={1}
            dy={10}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 10 }}
            width={25}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ddd'
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 10, fontSize: 12, display: 'flex', justifyContent: 'center' }} 
          />
          <Bar dataKey="noise" fill={TEMPLE_COLORS.noise} name="Noise Level" />
          <Bar dataKey="crowd" fill={TEMPLE_COLORS.crowd} name="Crowd Level" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;