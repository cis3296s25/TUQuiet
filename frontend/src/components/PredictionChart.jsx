import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fullTimeTemplate = [
  "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
];

const fillMissingHours = (data) => {
  const dataMap = Object.fromEntries(data.map((d) => [d.time, d]));
  return fullTimeTemplate.map((time) => ({
    time,
    noise: dataMap[time]?.noise ?? 0,
    crowd: dataMap[time]?.crowd ?? 0,
  }));
};

const PredictionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 mt-2">No prediction data yet.</p>;
  }

  const filledData = fillMissingHours(data);

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold mb-2">Predicted Noise & Crowd Levels</h3>
      <ResponsiveContainer width="100%" height={300}> 
        <BarChart data={filledData}>
          <XAxis 
            dataKey="time"
            ticks={fullTimeTemplate}
            angle={-45}
            textAnchor="end"
            interval={0}
            dy={10}
            style={{ fontSize: '10px' }}
          />
          <YAxis 
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]} 
          />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 12, gap: 32, display: 'flex', justifyContent: 'center' }} 
          />
          <Bar dataKey="noise" fill="#8884d8" name="Noise Level" />
          <Bar dataKey="crowd" fill="#82ca9d" name="Crowd Level" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;