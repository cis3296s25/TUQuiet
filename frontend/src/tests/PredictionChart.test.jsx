import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import PredictionChart from '../components/PredictionChart';

const renderPredictionChart = (data = []) => {
    return render(<PredictionChart data={data} />);
};

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserver;

test('PredictionChart renders correctly with no data', () => {
    renderPredictionChart();

    const fallbackMessage = screen.getByText('No prediction data yet.');
    expect(fallbackMessage).not.toBeNull();
});

test('PredictionChart renders correctly with data', () => {
    const data = [
        { time: '10:00', noise: 3, crowd: 4 },
        { time: '12:00', noise: 2, crowd: 5 },
    ];

    renderPredictionChart(data);

    const chartElement = screen.getByTestId('prediction-chart');
    expect(chartElement).not.toBeNull();
});