import {
    BarChart,
    Bar, 
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const PredictionChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-400 mt-2">No prediction data yet.</p>;
    }

    return (
        <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Predicted Noise & Crowd Levels</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="noise" fill="#8884d8" name="Noise Level" />
            <Bar dataKey="crowd" fill="#82ca9d" name="Crowd Level" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
};

export default PredictionChart;